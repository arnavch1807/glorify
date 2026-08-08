import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { Mail, Lock, User, Sparkles, ShieldAlert, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
export function Register() {
    const navigate = useNavigate();
    const { register, error, loading } = useAuthStore();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password)
            return;
        const success = await register(username, email, password, displayName || username);
        if (success) {
            navigate('/');
        }
    };
    return React.createElement('div', { className: 'min-h-screen w-full flex items-center justify-center relative p-6 overflow-hidden bg-glorify-bg-primary select-none font-sans' }, 
    // Glowing background mesh blobs
    React.createElement('div', { className: 'absolute top-[-10%] right-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-glorify-accent/5 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]' }), React.createElement('div', { className: 'absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-glorify-accent/5 blur-[100px] pointer-events-none animate-pulse duration-[6000ms]' }), 
    // Central Card Container
    React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.32, ease: 'easeOut' },
        className: 'w-full max-w-[420px] bg-glorify-bg-surface/25 border border-glorify-border-primary/10 rounded-[32px] p-8 backdrop-blur-2xl shadow-2xl z-10 flex flex-col gap-5 relative'
    }, 
    // Header brand
    React.createElement('div', { className: 'flex flex-col items-center gap-2 text-center' }, React.createElement('div', { className: 'w-12 h-12 rounded-full bg-glorify-accent/15 border border-glorify-accent flex items-center justify-center text-glorify-accent text-sm font-extrabold tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]' }, 'G'), React.createElement('h2', { className: 'text-2xl font-bold tracking-[0.25em] text-glorify-text-primary uppercase mt-2' }, 'CREATE ACCOUNT'), React.createElement('p', { className: 'text-xs text-glorify-text-muted mt-1' }, 'Create a free Glorify account to listen to your custom tracks.')), 
    // Error banner
    error &&
        React.createElement(motion.div, {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className: 'flex items-center gap-3 p-3.5 rounded-[16px] bg-glorify-error/10 border border-glorify-error/20 text-glorify-error text-xs font-medium'
        }, React.createElement(ShieldAlert, { className: 'w-4 h-4 flex-shrink-0' }), React.createElement('span', null, error)), 
    // Form
    React.createElement('form', { onSubmit: handleSubmit, className: 'flex flex-col gap-3.5' }, 
    // Username
    React.createElement('div', { className: 'flex flex-col gap-1.5' }, React.createElement('label', { className: 'text-xs font-bold text-glorify-text-secondary pl-1' }, 'Username'), React.createElement('div', { className: 'relative flex items-center' }, React.createElement(User, { className: 'absolute left-4 w-4 h-4 text-glorify-text-muted' }), React.createElement('input', {
        type: 'text',
        required: true,
        value: username,
        onChange: (e) => setUsername(e.target.value),
        placeholder: 'music_lover',
        className: 'w-full h-12 pl-11 pr-4 rounded-[16px] bg-glorify-bg-secondary/40 border border-glorify-border-primary/5 focus:border-glorify-accent text-sm text-glorify-text-primary placeholder-glorify-text-muted/40 outline-none transition-all focus-ring'
    }))), 
    // Display Name
    React.createElement('div', { className: 'flex flex-col gap-1.5' }, React.createElement('label', { className: 'text-xs font-bold text-glorify-text-secondary pl-1' }, 'Display Name (Optional)'), React.createElement('div', { className: 'relative flex items-center' }, React.createElement(BadgeCheck, { className: 'absolute left-4 w-4 h-4 text-glorify-text-muted' }), React.createElement('input', {
        type: 'text',
        value: displayName,
        onChange: (e) => setDisplayName(e.target.value),
        placeholder: 'John Doe',
        className: 'w-full h-12 pl-11 pr-4 rounded-[16px] bg-glorify-bg-secondary/40 border border-glorify-border-primary/5 focus:border-glorify-accent text-sm text-glorify-text-primary placeholder-glorify-text-muted/40 outline-none transition-all focus-ring'
    }))), 
    // Email
    React.createElement('div', { className: 'flex flex-col gap-1.5' }, React.createElement('label', { className: 'text-xs font-bold text-glorify-text-secondary pl-1' }, 'Email Address'), React.createElement('div', { className: 'relative flex items-center' }, React.createElement(Mail, { className: 'absolute left-4 w-4 h-4 text-glorify-text-muted' }), React.createElement('input', {
        type: 'email',
        required: true,
        value: email,
        onChange: (e) => setEmail(e.target.value),
        placeholder: 'name@domain.com',
        className: 'w-full h-12 pl-11 pr-4 rounded-[16px] bg-glorify-bg-secondary/40 border border-glorify-border-primary/5 focus:border-glorify-accent text-sm text-glorify-text-primary placeholder-glorify-text-muted/40 outline-none transition-all focus-ring'
    }))), 
    // Password
    React.createElement('div', { className: 'flex flex-col gap-1.5' }, React.createElement('label', { className: 'text-xs font-bold text-glorify-text-secondary pl-1' }, 'Password'), React.createElement('div', { className: 'relative flex items-center' }, React.createElement(Lock, { className: 'absolute left-4 w-4 h-4 text-glorify-text-muted' }), React.createElement('input', {
        type: 'password',
        required: true,
        value: password,
        onChange: (e) => setPassword(e.target.value),
        placeholder: '••••••••',
        className: 'w-full h-12 pl-11 pr-4 rounded-[16px] bg-glorify-bg-secondary/40 border border-glorify-border-primary/5 focus:border-glorify-accent text-sm text-glorify-text-primary placeholder-glorify-text-muted/40 outline-none transition-all focus-ring'
    }))), 
    // Submit button
    React.createElement(motion.button, {
        type: 'submit',
        disabled: loading,
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        className: 'w-full h-12 mt-3 rounded-[16px] bg-glorify-accent text-glorify-carbon-950 text-sm font-extrabold shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 outline-none focus-ring disabled:opacity-50 disabled:pointer-events-none'
    }, loading ? 'Creating Account...' : 'Sign Up Free', !loading && React.createElement(Sparkles, { className: 'w-4 h-4 fill-currentColor' }))), 
    // Footer links
    React.createElement('div', { className: 'text-center text-xs text-glorify-text-muted mt-2 font-medium' }, 'Already have an account? ', React.createElement(Link, { to: '/login', className: 'text-glorify-accent hover:underline font-bold outline-none focus-ring pl-0.5' }, 'Sign In Here'))));
}
//# sourceMappingURL=Register.js.map