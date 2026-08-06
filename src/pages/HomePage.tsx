import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, ListChecks, ShieldCheck, Sparkles } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Clock,
    title: '15 minutes suffisent',
    description: 'Un parcours guidé en 10 étapes claires, avec sauvegarde automatique de votre progression.',
  },
  {
    icon: ListChecks,
    title: 'Tout au même endroit',
    description: 'Informations personnelles, familiales, académiques et diplômes réunis dans un seul dossier.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurisé et fiable',
    description: 'Vos données transitent de façon sécurisée jusqu’aux services de scolarité de l’ESGAE.',
  },
];

export function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-secondary-200 ring-1 ring-white/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Admissions ouvertes
          </motion.div>

          <motion.img
            src="/logo.png"
            alt="Logo ESGAE"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 h-20 w-auto drop-shadow-lg sm:h-24"
          />

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-3xl font-heading text-3xl font-extrabold leading-tight text-white sm:text-5xl"
          >
            Votre pré-inscription à l’ESGAE commence ici
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-5 max-w-xl text-base text-primary-100 sm:text-lg"
          >
            Rejoignez la Grande École et donnez le meilleur départ à votre parcours académique.
            Un formulaire simple, guidé et sécurisé.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-9"
          >
            <Link
              to="/pre-inscription"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-400 px-7 py-3.5 text-sm font-semibold text-white shadow-soft-lg transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-base"
            >
              Commencer ma pré-inscription
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {HIGHLIGHTS.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-soft"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="font-heading text-base font-semibold text-primary-700">{item.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft/70">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
