import { BrowserRouter } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';
import { queryClient } from '@/api/queryClient';
import { persistOptions } from '@/api/persister';
import { ErrorFallback } from '@/components/ErrorFallback';
import { AppRoutes } from '@/routes/AppRoutes';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <ThemeProvider>
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
          <Toaster position="top-right" richColors closeButton />
        </PersistQueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
