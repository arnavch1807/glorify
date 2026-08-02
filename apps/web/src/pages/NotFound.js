import React from 'react';
import { Link } from 'react-router-dom';
import { EyeOff } from 'lucide-react';
export function NotFound() {
    return React.createElement('div', {
        className: 'min-h-[60vh] flex flex-col items-center justify-center text-center font-sans gap-ch-4',
    }, React.createElement('div', {
        className: 'p-ch-4 rounded-full bg-chotify-bg-secondary border border-chotify-border-primary text-chotify-accent',
    }, React.createElement(EyeOff, { className: 'w-ch-8 h-ch-8' })), React.createElement('h1', { className: 'text-2xl font-bold font-mono tracking-widest text-chotify-text-primary' }, '[ 404_NOT_FOUND ]'), React.createElement('p', { className: 'text-sm text-chotify-text-secondary max-w-xs' }, 'The sheet index or track signature requested does not exist in the active namespace.'), React.createElement(Link, {
        to: '/',
        className: 'mt-ch-2 px-ch-4 py-ch-2 rounded-ch-sm border border-chotify-border-primary text-xs font-mono hover:bg-chotify-bg-secondary text-chotify-text-primary cursor-pointer active:scale-95 transition-all outline-none focus-ring',
    }, 'Return to Home Workspace'));
}
//# sourceMappingURL=NotFound.js.map