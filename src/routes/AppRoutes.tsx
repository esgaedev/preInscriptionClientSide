import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PreRegistrationSkeleton } from '@/components/form/PreRegistrationSkeleton';

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
            <Suspense fallback={<PreRegistrationSkeleton />}>
              <PreRegistrationPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
