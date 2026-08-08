import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { SplashScreen } from './components/SplashScreen.js';
import { LayoutShell } from './components/LayoutShell.js';
import { CommandPalette } from './components/CommandPalette.js';
import { Home } from './pages/Home.js';
import { Search } from './pages/Search.js';
import { Studio } from './pages/Studio.js';
import { Library } from './pages/Library.js';
import { Settings } from './pages/Settings.js';
import { Notifications } from './pages/Notifications.js';
import { AlbumPage } from './pages/AlbumPage.js';
import { ArtistPage } from './pages/ArtistPage.js';
import { PlaylistPage } from './pages/PlaylistPage.js';
import { GenrePage } from './pages/GenrePage.js';
import { CollectionPage } from './pages/CollectionPage.js';
import { NotFound } from './pages/NotFound.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { ForgotPassword } from './pages/ForgotPassword.js';
import { useAuthStore } from './store/authStore.js';
import { usePlayerStore } from './store/playerStore.js';
import { useEffect } from 'react';
export default function App() {
    const [isSplashComplete, setIsSplashComplete] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const { syncCloudData } = usePlayerStore();
    useEffect(() => {
        if (isAuthenticated) {
            syncCloudData().catch((err) => console.error('Sync failed:', err));
        }
    }, [isAuthenticated, syncCloudData]);
    return React.createElement(ErrorBoundary, null, !isSplashComplete
        ? React.createElement(SplashScreen, { onComplete: () => setIsSplashComplete(true) })
        : React.createElement(BrowserRouter, null, React.createElement(Routes, null, 
        // Public Authentication Routes
        React.createElement(Route, {
            path: '/login',
            element: isAuthenticated ? React.createElement(Navigate, { to: '/', replace: true }) : React.createElement(Login),
        }), React.createElement(Route, {
            path: '/register',
            element: isAuthenticated ? React.createElement(Navigate, { to: '/', replace: true }) : React.createElement(Register),
        }), React.createElement(Route, {
            path: '/forgot-password',
            element: isAuthenticated ? React.createElement(Navigate, { to: '/', replace: true }) : React.createElement(ForgotPassword),
        }), 
        // Protected Application Routes
        React.createElement(Route, {
            path: '*',
            element: !isAuthenticated
                ? React.createElement(Navigate, { to: '/login', replace: true })
                : React.createElement(LayoutShell, null, React.createElement(Routes, null, React.createElement(Route, { path: '/', element: React.createElement(Home) }), React.createElement(Route, { path: '/search', element: React.createElement(Search) }), React.createElement(Route, { path: '/studio', element: React.createElement(Studio) }), React.createElement(Route, { path: '/library', element: React.createElement(Library) }), React.createElement(Route, { path: '/settings', element: React.createElement(Settings) }), React.createElement(Route, { path: '/notifications', element: React.createElement(Notifications) }), React.createElement(Route, { path: '/album/:id', element: React.createElement(AlbumPage) }), React.createElement(Route, { path: '/artist/:id', element: React.createElement(ArtistPage) }), React.createElement(Route, { path: '/playlist/:id', element: React.createElement(PlaylistPage) }), React.createElement(Route, { path: '/genre/:id', element: React.createElement(GenrePage) }), React.createElement(Route, { path: '/collection/:id', element: React.createElement(CollectionPage) }), React.createElement(Route, { path: '*', element: React.createElement(NotFound) }))),
        })), isAuthenticated && React.createElement(CommandPalette)));
}
//# sourceMappingURL=App.js.map