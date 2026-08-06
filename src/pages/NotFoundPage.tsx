import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="text-2xl font-bold text-primary-700">Page introuvable</h1>
      <p className="mt-2 max-w-sm text-sm text-ink-soft/70">
        La page que vous recherchez n’existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-primary-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-600"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
