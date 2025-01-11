import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppRouter } from './routes';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1
        }
    }
});

function App() {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                        <Toaster position="top-right" />
                        <AppRouter />
                    </div>
                </ThemeProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
