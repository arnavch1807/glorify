import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { SplashScreen } from './components/SplashScreen.js';
import { LayoutShell } from './components/LayoutShell.js';
import { CommandPalette } from './components/CommandPalette.js';
import { Home } from './pages/Home.js';
import { Explore } from './pages/Explore.js';
import { Studio } from './pages/Studio.js';
import { Library } from './pages/Library.js';
import { Settings } from './pages/Settings.js';
import { NotFound } from './pages/NotFound.js';
export default function App() {
    const [isSplashComplete, setIsSplashComplete] = useState(false);
    return React.createElement(ErrorBoundary, null, !isSplashComplete
        ? React.createElement(SplashScreen, { onComplete: () => setIsSplashComplete(true) })
        : React.createElement(BrowserRouter, null, React.createElement(LayoutShell, null, React.createElement(Routes, null, React.createElement(Route, { path: '/', element: React.createElement(Home) }), React.createElement(Route, { path: '/explore', element: React.createElement(Explore) }), React.createElement(Route, { path: '/studio', element: React.createElement(Studio) }), React.createElement(Route, { path: '/library', element: React.createElement(Library) }), React.createElement(Route, { path: '/settings', element: React.createElement(Settings) }), React.createElement(Route, { path: '*', element: React.createElement(NotFound) }))), React.createElement(CommandPalette)));
}
//# sourceMappingURL=App.js.map