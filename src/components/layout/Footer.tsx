export function Footer() {
  return (
    <footer className="mt-auto bg-primary-800 text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm sm:px-6">
        <p className="font-heading font-semibold text-white">ESGAE — la Grande École</p>
        <p className="mt-1">© {new Date().getFullYear()} ESGAE. Tous droits réservés.</p>
        <p className="mt-1">
          <a href="https://esgae.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            esgae.org
          </a>
        </p>
      </div>
    </footer>
  );
}
