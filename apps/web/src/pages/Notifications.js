import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, XCircle, Calendar, Check } from 'lucide-react';
import { CloudRepository } from '../repositories/cloudRepository.js';
import { Button } from '@chotify/ui';
export function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const data = await CloudRepository.getNotifications();
            setNotifications(data);
        }
        catch (err) {
            console.error('Failed to load notifications:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, []);
    const handleMarkRead = async (id) => {
        try {
            await CloudRepository.markNotificationRead(id);
            setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
        }
        catch (err) {
            console.error('Failed to mark read:', err);
        }
    };
    const handleMarkAllRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read);
            await Promise.all(unread.map(n => CloudRepository.markNotificationRead(n.id)));
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
        catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };
    const renderIcon = (type) => {
        const className = "w-ch-5 h-ch-5 flex-shrink-0";
        switch (type) {
            case 'success':
                return React.createElement(CheckCircle2, { className: `${className} text-emerald-500` });
            case 'warning':
                return React.createElement(AlertCircle, { className: `${className} text-amber-500` });
            case 'error':
                return React.createElement(XCircle, { className: `${className} text-rose-500` });
            default:
                return React.createElement(Info, { className: `${className} text-blue-500` });
        }
    };
    const unreadCount = notifications.filter(n => !n.read).length;
    return React.createElement('div', { className: 'flex flex-col gap-ch-6 w-full text-glorify-text-primary' }, 
    // Header Panel
    React.createElement('div', { className: 'flex items-center justify-between border-b border-glorify-border-primary/10 pb-ch-4' }, React.createElement('div', { className: 'flex items-center gap-ch-3' }, React.createElement(Bell, { className: 'w-ch-6 h-ch-6 text-glorify-accent' }), React.createElement('div', { className: 'flex flex-col' }, React.createElement('h1', { className: 'text-2xl font-bold tracking-tight' }, 'Notifications'), React.createElement('span', { className: 'text-xs text-glorify-text-secondary mt-0.5' }, unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'))), unreadCount > 0 &&
        React.createElement(Button, {
            variant: 'secondary',
            onClick: handleMarkAllRead,
            className: 'rounded-full text-xs font-semibold px-ch-4 py-2 hover:bg-glorify-bg-secondary'
        }, 'Mark all as read')), 
    // Notifications Body
    isLoading
        ? React.createElement('div', { className: 'flex items-center justify-center min-h-[300px]' }, React.createElement('div', { className: 'w-ch-8 h-ch-8 border-2 border-glorify-accent border-t-transparent rounded-full animate-spin' }))
        : notifications.length === 0
            ? React.createElement('div', { className: 'flex flex-col items-center justify-center text-center py-16 gap-ch-4 bg-glorify-bg-surface/20 border border-glorify-border-primary/5 rounded-[22px] p-8' }, React.createElement(Bell, { className: 'w-12 h-12 text-glorify-text-muted/40 stroke-[1.5]' }), React.createElement('div', { className: 'flex flex-col gap-1' }, React.createElement('h2', { className: 'text-base font-semibold text-glorify-text-secondary' }, 'No notifications yet'), React.createElement('p', { className: 'text-xs text-glorify-text-muted max-w-xs' }, 'We will notify you here when you compose AI tracks, download songs offline, or verify credentials.')))
            : React.createElement('div', { className: 'flex flex-col gap-ch-3' }, notifications.map(n => React.createElement('div', {
                key: n.id,
                onClick: () => !n.read && handleMarkRead(n.id),
                className: `p-ch-4 rounded-ch-xl border transition-all duration-300 flex items-start gap-ch-4 relative overflow-hidden group ${!n.read
                    ? 'bg-glorify-bg-surface/50 border-glorify-accent/20 cursor-pointer shadow-sm hover:border-glorify-accent/40'
                    : 'bg-glorify-bg-surface/20 border-glorify-border-primary/5 opacity-80'}`
            }, 
            // Unread Glow Indicator
            !n.read && React.createElement('div', { className: 'absolute left-0 top-0 bottom-0 w-[4px] bg-glorify-accent' }), 
            // Icon
            renderIcon(n.type), 
            // Text Content
            React.createElement('div', { className: 'flex-1 flex flex-col gap-1 min-w-0 pr-ch-6' }, React.createElement('span', { className: `text-sm font-semibold truncate ${!n.read ? 'text-glorify-text-primary' : 'text-glorify-text-secondary'}` }, n.title), React.createElement('span', { className: 'text-xs text-glorify-text-secondary leading-relaxed font-normal' }, n.message), React.createElement('div', { className: 'flex items-center gap-ch-1.5 text-[10px] text-glorify-text-muted mt-1 font-medium' }, React.createElement(Calendar, { className: 'w-ch-3 h-ch-3' }), React.createElement('span', null, new Date(n.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })))), 
            // Mark Single Read Action
            !n.read &&
                React.createElement('button', {
                    onClick: (e) => {
                        e.stopPropagation();
                        handleMarkRead(n.id);
                    },
                    className: 'opacity-0 group-hover:opacity-100 absolute right-ch-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-glorify-bg-secondary hover:bg-glorify-accent/10 hover:text-glorify-accent text-glorify-text-secondary transition-all cursor-pointer outline-none'
                }, React.createElement(Check, { className: 'w-ch-3.5 h-ch-3.5' }))))));
}
//# sourceMappingURL=Notifications.js.map