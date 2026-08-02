import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { SplashScreen } from './components/SplashScreen.js';
import { LayoutShell } from './components/LayoutShell.js';
import { CommandPalette } from './components/CommandPalette.js';
import { Home } from './pages/Home.js';
import { Search } from './pages/Search.js';
import { Studio } from './pages/Studio.js';
import { Library } from './pages/Library.js';
import { Settings } from './pages/Settings.js';
import { AlbumPage } from './pages/AlbumPage.js';
import { ArtistPage } from './pages/ArtistPage.js';
import { PlaylistPage } from './pages/PlaylistPage.js';
import { NotFound } from './pages/NotFound.js';

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  return React.createElement(
    ErrorBoundary,
    null,
    !isSplashComplete
      ? React.createElement(SplashScreen, { onComplete: () => setIsSplashComplete(true) })
      : React.createElement(
          BrowserRouter,
          null,
          React.createElement(
            LayoutShell,
            null,
            React.createElement(
              Routes,
              null,
              React.createElement(Route, { path: '/', element: React.createElement(Home) }),
              React.createElement(Route, { path: '/search', element: React.createElement(Search) }),
              React.createElement(Route, { path: '/studio', element: React.createElement(Studio) }),
              React.createElement(Route, { path: '/library', element: React.createElement(Library) }),
              React.createElement(Route, { path: '/settings', element: React.createElement(Settings) }),
              React.createElement(Route, { path: '/album/:id', element: React.createElement(AlbumPage) }),
              React.createElement(Route, { path: '/artist/:id', element: React.createElement(ArtistPage) }),
              React.createElement(Route, { path: '/playlist/:id', element: React.createElement(PlaylistPage) }),
              React.createElement(Route, { path: '*', element: React.createElement(NotFound) })
            )
          ),
          React.createElement(CommandPalette)
        )
  );
}
