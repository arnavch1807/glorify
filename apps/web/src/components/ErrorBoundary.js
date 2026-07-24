import React, { Component } from 'react';
export class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null,
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return React.createElement('div', {
                className: 'min-h-screen flex flex-col items-center justify-center p-ch-6 bg-chotify-carbon-950 text-chotify-platinum-50 font-sans',
            }, React.createElement('div', {
                className: 'max-w-md w-full p-ch-6 rounded-ch-lg bg-chotify-carbon-900 border border-chotify-carbon-800 text-center shadow-ch-glow',
            }, React.createElement('div', {
                className: 'text-2xl font-bold font-mono text-chotify-aura-gold mb-ch-3',
            }, '[ ERROR_STATE ]'), React.createElement('h1', { className: 'text-xl font-bold mb-ch-2' }, 'Something went wrong'), React.createElement('p', { className: 'text-sm text-chotify-platinum-400 mb-ch-4' }, this.state.error?.message || 'An unexpected rendering error occurred.'), React.createElement('button', {
                onClick: () => window.location.reload(),
                className: 'px-ch-4 py-ch-2 text-sm font-medium rounded-ch-sm bg-chotify-aura-gold text-chotify-carbon-950 cursor-pointer active:scale-95 transition-all outline-none',
            }, 'Reload Workspace')));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map