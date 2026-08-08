import dotenv from 'dotenv';
import crypto from 'crypto';
import https from 'https';

// Load environment variables
dotenv.config();

const publicKey = process.env.ATLAS_PUBLIC_KEY;
const privateKey = process.env.ATLAS_PRIVATE_KEY;
const projectId = process.env.ATLAS_PROJECT_ID;

function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

function parseWwwAuthenticate(header: string): Record<string, string> {
  const params: Record<string, string> = {};
  const regex = /(\w+)="?([^",]+)"?/g;
  let match;
  while ((match = regex.exec(header)) !== null) {
    params[match[1]] = match[2];
  }
  return params;
}

function makeDigestRequest(
  urlStr: string,
  method: string,
  publicKey: string,
  privateKey: string,
  body?: string,
  authHeader?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: headers
    }, (res) => {
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode === 401 && !authHeader) {
          const authWww = res.headers['www-authenticate'];
          if (!authWww) {
            return reject(new Error('Missing WWW-Authenticate header on 401 response'));
          }
          const params = parseWwwAuthenticate(authWww);
          const realm = params.realm;
          const nonce = params.nonce;
          const qop = params.qop;
          const opaque = params.opaque;
          
          const nc = '00000001';
          const cnonce = crypto.randomBytes(8).toString('hex');
          
          const ha1 = md5(`${publicKey}:${realm}:${privateKey}`);
          const ha2 = md5(`${method}:${url.pathname}`);
          
          let response = '';
          if (qop === 'auth') {
            response = md5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`);
          } else {
            response = md5(`${ha1}:${nonce}:${ha2}`);
          }
          
          let digestAuth = `Digest username="${publicKey}", realm="${realm}", nonce="${nonce}", uri="${url.pathname}", response="${response}"`;
          if (qop) {
            digestAuth += `, qop=${qop}, nc=${nc}, cnonce="${cnonce}"`;
          }
          if (opaque) {
            digestAuth += `, opaque="${opaque}"`;
          }
          
          // Retry request with Authorization header
          resolve(makeDigestRequest(urlStr, method, publicKey, privateKey, body, digestAuth));
        } else if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData);
        } else {
          reject(new Error(`Atlas API returned status ${res.statusCode}: ${responseData}`));
        }
      });
    });
    
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

function getPublicIp(): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', reject);
  });
}

async function run() {
  if (
    !publicKey || !privateKey || !projectId ||
    publicKey === 'your_atlas_public_key_here' ||
    privateKey === 'your_atlas_private_key_here' ||
    projectId === 'your_atlas_project_id_here'
  ) {
    console.log('ℹ MongoDB Atlas API keys not configured. Skipping IP auto-updater.');
    console.log('  Tip: Set ATLAS_PUBLIC_KEY, ATLAS_PRIVATE_KEY, and ATLAS_PROJECT_ID in apps/server/.env to auto-whitelist your IP.');
    process.exit(0);
  }

  try {
    console.log('🔍 Detecting current public IP address...');
    const currentIp = await getPublicIp();
    console.log(`Current Public IP: ${currentIp}`);

    const accessListUrl = `https://cloud.mongodb.com/api/atlas/v1.0/groups/${projectId}/accessList`;
    
    console.log('🔑 Checking MongoDB Atlas Network Access List...');
    const responseStr = await makeDigestRequest(accessListUrl, 'GET', publicKey, privateKey);
    const data = JSON.parse(responseStr);
    
    const results = data.results || [];
    const isWhitelisted = results.some((r: any) => r.ipAddress === currentIp);

    if (isWhitelisted) {
      console.log(`✓ Current IP (${currentIp}) is already whitelisted on MongoDB Atlas. Skipping write.`);
      process.exit(0);
    }

    console.log(`➕ Adding IP ${currentIp} to Atlas whitelist...`);
    const payload = JSON.stringify([{
      ipAddress: currentIp,
      comment: `Glorify Dev Local Auto (${new Date().toLocaleDateString()})`
    }]);

    await makeDigestRequest(accessListUrl, 'POST', publicKey, privateKey, payload);
    console.log(`🚀 IP ${currentIp} whitelisted successfully on MongoDB Atlas!`);
    
    // Allow a short delay for Atlas to apply network rules
    console.log('⌛ Waiting 2 seconds for Atlas changes to propagate...');
    await new Promise(r => setTimeout(r, 2000));
    
  } catch (err: any) {
    console.error('❌ Failed to update MongoDB Atlas whitelisted IP:', err.message || err);
    // Exit with 0 to allow server to try starting anyway as a fallback
    process.exit(0);
  }
}

run();
