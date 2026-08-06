import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FormLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function FormLayout({ title, description, children }: FormLayoutProps) {
  return (
    <motion.section
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      aria-labelledby="step-title"
    >
      <div className="mb-6">
        <h2 id="step-title" className="text-xl font-bold text-primary-700 dark:text-primary-400 sm:text-2xl transition-colors duration-300">
          {title}
        </h2>
        {description && <p className="mt-1.5 text-sm text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </motion.section>
  );
}
