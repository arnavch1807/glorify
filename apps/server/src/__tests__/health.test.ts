import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Server Integration - Health & API Checklists', () => {
  it('GET /api/v1/health/liveness should return UP status', async () => {
    const res = await request(app)
      .get('/api/v1/health/liveness')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api/v1/health/readiness should report database and cache states', async () => {
    const res = await request(app)
      .get('/api/v1/health/readiness')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toHaveProperty('status', 'UP');
    expect(res.body.details).toHaveProperty('database', 'UP');
    expect(res.body.details).toHaveProperty('cache', 'UP');
  });

  it('GET /api/v1/404-fallback should return 404 with RFC7807 problem details', async () => {
    const res = await request(app)
      .get('/api/v1/non-existent-endpoint')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(res.body).toHaveProperty('type', 'https://glorify.com/errors/not-found');
    expect(res.body).toHaveProperty('title', 'Not Found');
    expect(res.body).toHaveProperty('status', 404);
    expect(res.body).toHaveProperty('detail');
  });
});
