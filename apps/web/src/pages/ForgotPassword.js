import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Sparkles, ArrowLeft, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '../utils/apiClient.js';
export function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email)
            return;
        setLoading(true);
        setError('');
        try {
            await apiClient.post('/api/auth/forgot-password', { email });
            setSent(true);
        }
        catch (err) {
            setError(err.response?.data?.message || 'Failed to send recovery email.');
        }
        finally {
            setLoading(false);
        }
    };
    return React.createElement('div', { className: 'min-h-screen w-full flex items-center justify-center relative p-6 overflow-hidden bg-glorify-bg-primary select-none font-sans' }, 
    // Glowing background mesh blobs
    React.createElement('div', { className: 'absolute top-[-10%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-glorify-accent/5 blur-[120px] pointer-events-none animate-pulse duration-[8000ms]' }), React.createElement('div', { className: 'absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-glorify-accent/5 blur-[100px] pointer-events-none animate-pulse duration-[6000ms]' }), 
    // Central Card Container
    React.createElement(motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.32, ease: 'easeOut' },
        className: 'w-full max-w-[420px] bg-glorify-bg-surface/25 border border-glorify-border-primary/10 rounded-[32px] p-8 backdrop-blur-2xl shadow-2xl z-10 flex flex-col gap-6 relative'
    }, 
    // Header brand
    React.createElement('div', { className: 'flex flex-col items-center gap-2 text-center' }, React.createElement('div', { className: 'w-12 h-12 rounded-full bg-glorify-accent/15 border border-glorify-accent flex items-center justify-center text-glorify-accent text-sm font-extrabold tracking-widest shadow-[0_0_20px_rgba(212,175,55,0.2)]' }, 'G'), React.createElement('h2', { className: 'text-2xl font-bold tracking-[0.25em] text-glorify-text-primary uppercase mt-2' }, 'RECOVER PASSWORD'), React.createElement('p', { className: 'text-xs text-glorify-text-muted mt-1' }, 'Enter your email address and we will send password recovery instructions.')), sent ?
        React.createElement(motion.div, {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            className: 'flex flex-col items-center gap-4 text-center py-4'
        }, React.createElement('div', { className: 'w-14 h-14 rounded-full bg-glorify-accent/10 text-glorify-accent flex items-center justify-center mb-2' }, React.createElement(BadgeCheck, { className: 'w-8 h-8' })), React.createElement('h3', { className: 'text-sm font-bold text-glorify-text-primary' }, 'Recovery Instructions Sent'), React.createElement('p', { className: 'text-xs text-glorify-text-muted leading-relaxed px-2' }, `A password reset link has been dispatched to ${email}. Check your inbox and spam folders.`), React.createElement(motion.button, {
            onClick: () => navigate('/login'),
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
            className: 'w-full h-11 mt-4 rounded-[16px] bg-glorify-accent text-glorify-carbon-950 text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 outline-none focus-ring'
        }, React.createElement(ArrowLeft, { className: 'w-3.5 h-3.5' }), 'Return to Log In'))
        :
            React.createElement(React.Fragment, null, 
            // Error Banner
            error &&
                React.createElement('div', { className: 'p-3.5 rounded-[16px] bg-glorify-error/10 border border-glorify-error/20 text-glorify-error text-xs font-medium' }, error), 
            // Form
            React.createElement('form', { onSubmit: handleSubmit, className: 'flex flex-col gap-4' }, 
            // Email Input
            React.createElement('div', { className: 'flex flex-col gap-1.5' }, React.createElement('label', { className: 'text-xs font-bold text-glorify-text-secondary pl-1' }, 'Email Address'), React.createElement('div', { className: 'relative flex items-center' }, React.createElement(Mail, { className: 'absolute left-4 w-4 h-4 text-glorify-text-muted' }), React.createElement('input', {
                type: 'email',
                required: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: 'name@domain.com',
                className: 'w-full h-12 pl-11 pr-4 rounded-[16px] bg-glorify-bg-secondary/40 border border-glorify-border-primary/5 focus:border-glorify-accent text-sm text-glorify-text-primary placeholder-glorify-text-muted/40 outline-none transition-all focus-ring'
            }))), 
            // Submit Button
            React.createElement(motion.button, {
                type: 'submit',
                disabled: loading,
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                className: 'w-full h-12 mt-4 rounded-[16px] bg-glorify-accent text-glorify-carbon-950 text-sm font-extrabold shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 outline-none focus-ring disabled:opacity-50 disabled:pointer-events-none'
            }, loading ? 'Sending Request...' : 'Send Recovery Email', !loading && React.createElement(Sparkles, { className: 'w-4 h-4 fill-currentColor' }))), 
            // Back to Login Link
            React.createElement('div', { className: 'text-center mt-2' }, React.createElement(Link, { to: '/login', className: 'text-xs text-glorify-text-secondary hover:text-glorify-accent font-bold outline-none focus-ring inline-flex items-center gap-1.5' }, React.createElement(ArrowLeft, { className: 'w-3.5 h-3.5' }), 'Back to Sign In')))));
}
//# sourceMappingURL=ForgotPassword.js.map