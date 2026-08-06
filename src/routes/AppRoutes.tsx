import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { Loader } from '@/components/ui/Loader';

const PreRegistrationPage = lazy(() =>
  import('@/pages/PreRegistrationPage').then((m) => ({ default: m.PreRegistrationPage })),
);

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/pre-inscription"
          element={
            <Suspense fallback={<Loader label="Chargement du formulaire..." />}>
              <PreRegistrationPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
