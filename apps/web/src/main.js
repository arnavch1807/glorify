import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@chotify/ui';
import App from './App.js';
import './styles/index.css';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(React.StrictMode, null, React.createElement(QueryClientProvider, { client: queryClient }, React.createElement(ThemeProvider, null, React.createElement(App)))));
//# sourceMappingURL=main.js.map