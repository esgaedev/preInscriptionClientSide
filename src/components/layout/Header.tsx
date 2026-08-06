import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 dark:border-dark-border bg-white/90 dark:bg-dark-card/90 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo ESGAE" className="h-10 w-auto sm:h-11" />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-heading text-sm font-bold text-primary-700 dark:text-primary-400 transition-colors duration-300">ESGAE</span>
            <span className="text-[11px] text-ink-soft/60 dark:text-dark-text-secondary/60 transition-colors duration-300">Pré-inscription en ligne</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://esgae.org"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-2 text-sm font-medium text-primary-700 dark:text-primary-400 transition-colors hover:bg-primary-50 dark:hover:bg-dark-surface"
          >
            esgae.org
          </a>
        </div>
      </div>
    </header>
  );
}
