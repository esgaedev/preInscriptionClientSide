import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FileText, Check, ArrowRight, Clock, ListChecks } from 'lucide-react';
import { toast } from 'sonner';

/** Clés localStorage utilisées pour retenir la lecture/acceptation de la charte. */
const CHARTER_READ_KEY = 'esgai-charter-read';
const CHARTER_ACCEPTED_KEY = 'esgai-charter-accepted';

/**
 * Props du composant EngagementForm
 */
export interface EngagementFormProps {
  /** Nom de l'étudiant (rempli automatiquement depuis le formulaire) */
  studentName?: string;
  /** Date (remplie automatiquement) */
  date?: string;
  /** Titre personnalisé de la charte */
  title?: string;
  /** Sous-titre personnalisé */
  subtitle?: string;
  /** Contenu personnalisé (remplace le contenu par défaut, désactive la navigation par section) */
  content?: React.ReactNode;
  /** Callback appelé lors de l'acceptation */
  onAccept?: () => void;
  /** Callback appelé lors de l'annulation */
  onCancel?: () => void;
  /** Callback appelé quand la case est cochée/décochée */
  onCheckboxChange?: (checked: boolean) => void;
  /** État d'acceptation contrôlé de l'extérieur */
  accepted?: boolean;
  /** Mode contrôlé ou non */
  controlled?: boolean;
  /** Texte du bouton d'acceptation */
  acceptButtonText?: string;
  /** Texte du bouton d'annulation */
  cancelButtonText?: string;
  /** Afficher ou masquer la barre de progression */
  showProgress?: boolean;
  /** Afficher ou masquer le bouton d'acceptation */
  showAcceptButton?: boolean;
}

/**
 * Structure des sections de la charte par défaut.
 * Le numéro est signifiant : ce sont de véritables clauses ordonnées d'un
 * même document contractuel, pas une décoration.
 */
const SECTIONS: { id: string; number: string; title: string; items: string[] }[] = [
  {
    id: 'academique',
    number: '01',
    title: 'Engagement académique',
    items: [
      "Je m'engage à suivre assidûment les cours, à respecter les horaires, à participer activement aux travaux dirigés, évaluations et examens.",
      "Je m'engage à produire un travail personnel honnête et à ne pas recourir à la fraude, au plagiat ou à toute forme de tricherie.",
    ],
  },
  {
    id: 'comportement',
    number: '02',
    title: 'Comportement et respect',
    items: [
      "Je m'engage à adopter un comportement respectueux envers les enseignants, le personnel administratif, mes camarades et toute personne liée à l'établissement.",
      "Je m'interdis toute forme de violence verbale, physique, psychologique ou symbolique.",
    ],
  },
  {
    id: 'institutionnelle',
    number: '03',
    title: 'Vie institutionnelle et associative',
    items: [
      "Je respecte les règlements intérieurs, les règles de discipline et les procédures de l'établissement.",
      "Je participe, dans la mesure de mes capacités, à la vie étudiante, associative ou citoyenne, dans un esprit de collaboration et de responsabilité.",
    ],
  },
  {
    id: 'ressources',
    number: '04',
    title: 'Utilisation des ressources',
    items: [
      "Je m'engage à utiliser les infrastructures, outils informatiques, bibliothèques, salles de classe et autres ressources de manière responsable.",
      "Je prends soin du matériel mis à disposition et m'engage à signaler toute anomalie.",
    ],
  },
  {
    id: 'tenue',
    number: '05',
    title: 'Tenue vestimentaire et hygiène',
    items: [
      "Je m'engage à porter une tenue correcte et décente, conforme aux exigences de l'établissement, en toute circonstance.",
      "Je respecte les règles d'hygiène et de sécurité en vigueur dans l'établissement.",
    ],
  },
  {
    id: 'ethique',
    number: '06',
    title: "Esprit d'éthique et de responsabilité",
    items: [
      "Je m'interdis toute activité portant atteinte à l'image ou au bon fonctionnement de l'établissement (diffamation, publication inappropriée sur les réseaux sociaux, etc.).",
      "Je m'engage à défendre les valeurs de probité, de tolérance, d'équité, de civisme et d'inclusion.",
    ],
  },
  {
    id: 'frais',
    number: '07',
    title: "Frais d'inscription et de réinscription",
    items: [
      "Je confirme mon inscription ou réinscription et reconnais que les frais correspondants ne sont pas remboursables.",
    ],
  },
];

/** Contenu par défaut, rendu à partir de SECTIONS pour rester une source unique de vérité. */
function BuiltInCharter({
  registerRef,
}: {
  registerRef: (id: string) => (el: HTMLElement | null) => void;
}) {
  return (
    <div className="space-y-10">
      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          ref={registerRef(section.id)}
          className="scroll-mt-4"
        >
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-xs font-semibold tabular-nums text-primary-600 dark:text-primary-400 transition-colors duration-300">
              {section.number}
            </span>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-dark-text tracking-tight transition-colors duration-300">
              {section.title}
            </h3>
          </div>
          <ul className="space-y-2.5 pl-7">
            {section.items.map((item, i) => (
              <li
                key={i}
                className="relative text-[14px] leading-relaxed text-slate-600 dark:text-dark-text-secondary before:absolute before:-left-4 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-slate-300 dark:before:bg-dark-surface transition-colors duration-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/**
 * Composant EngagementForm
 *
 * Formulaire d'engagement avec suivi de lecture, navigation par section et
 * validation explicite avant acceptation.
 */
export function EngagementForm({
  studentName = '',
  date: propDate,
  title = "Charte d'engagement de l'étudiant(e)",
  subtitle = "En m'inscrivant à l'ESGAE, je m'engage à respecter les principes, les règles et les valeurs suivantes pendant toute la durée de ma formation.",
  content,
  onAccept,
  onCancel,
  onCheckboxChange,
  accepted: controlledAccepted,
  controlled = false,
  acceptButtonText = "J'accepte et je continue",
  cancelButtonText = 'Annuler',
  showProgress = true,
  showAcceptButton = true,
}: EngagementFormProps) {
  const isCustomContent = content !== undefined;
  const prefersReducedMotion = useReducedMotion();

  // État initial lu de façon synchrone depuis localStorage (pas via useEffect)
  // pour éviter un flash "non lu / non coché" au (re)montage du composant.
  const savedRead = typeof window !== 'undefined' && localStorage.getItem(CHARTER_READ_KEY) === 'true';
  const savedAccepted = typeof window !== 'undefined' && localStorage.getItem(CHARTER_ACCEPTED_KEY) === 'true';

  // État local pour le mode non contrôlé
  const [localAccepted, setLocalAccepted] = useState(() => !controlled && savedAccepted);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(() => savedRead);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isChecked, setIsChecked] = useState(() => savedAccepted);
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0]?.id ?? '');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Sauvegarder l'état dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem(CHARTER_READ_KEY, String(hasScrolledToBottom));
  }, [hasScrolledToBottom]);

  useEffect(() => {
    localStorage.setItem(CHARTER_ACCEPTED_KEY, String(isChecked));
  }, [isChecked]);

  const registerRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    []
  );

  // Date actuelle formatée
  const currentDate =
    propDate ||
    new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  // Temps de lecture estimé (≈200 mots/min), calculé une seule fois
  const estimatedMinutes = useMemo(() => {
    const wordCount = SECTIONS.flatMap((s) => s.items.join(' ').split(/\s+/)).length;
    return Math.max(1, Math.round(wordCount / 200));
  }, []);

  // État d'acceptation (contrôlé ou local)
  const accepted = controlled ? controlledAccepted : localAccepted;

  /**
   * Gestion du scroll avec détection de fin de lecture
   */
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    const roundedProgress = Math.min(100, Math.max(0, progress || 0));

    setScrollProgress(roundedProgress);

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      toast.success('Vous avez lu toute la charte', {
        icon: <Check className="h-4 w-4" />,
      });
    }
  }, [hasScrolledToBottom]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /**
   * Suivi de la section active pendant le défilement, pour la barre latérale.
   */
  useEffect(() => {
    if (isCustomContent) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { root: container, rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

    SECTIONS.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isCustomContent]);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    el?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const handleCheckboxChange = (checked: boolean) => {
    if (!hasScrolledToBottom) return;
    setIsChecked(checked);
    if (!controlled) setLocalAccepted(checked);
    onCheckboxChange?.(checked);
  };

  const handleAccept = () => {
    if (hasScrolledToBottom && isChecked) {
      if (!controlled) setLocalAccepted(true);
      onAccept?.();
      toast.success("Charte d'engagement acceptée");
    }
  };

  const handleCancel = () => {
    if (!controlled) {
      setLocalAccepted(false);
      setIsChecked(false);
      setHasScrolledToBottom(false);
      setScrollProgress(0);
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
    }
    onCancel?.();
  };

  const isAcceptDisabled = !hasScrolledToBottom || !isChecked;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white dark:bg-dark-card rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(15,23,42,0.12)] dark:shadow-soft-dark border border-slate-200/80 dark:border-dark-border overflow-hidden transition-colors duration-300"
      >
        {/* Header */}
        <div className="px-6 py-7 sm:px-9 sm:py-9 border-b border-slate-100 dark:border-dark-border transition-colors duration-300">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-colors duration-300">
              <FileText className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-dark-text tracking-tight transition-colors duration-300">
                {title}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-500 dark:text-dark-text-secondary max-w-2xl transition-colors duration-300">
                {subtitle}
              </p>
              {!isCustomContent && (
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-medium text-slate-400 dark:text-dark-text-secondary/70 transition-colors duration-300">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="h-3.5 w-3.5" />
                    {SECTIONS.length} sections
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    ~{estimatedMinutes} min de lecture
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        {showProgress && (
          <div className="h-[3px] w-full bg-slate-100 dark:bg-dark-surface transition-colors duration-300">
            <motion.div
              className="h-full bg-primary-600 dark:bg-primary-500 transition-colors duration-300"
              initial={false}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.15, ease: 'linear' }}
            />
          </div>
        )}

        {/* Corps : rail de navigation + contenu scrollable */}
        <div className="flex">
          {!isCustomContent && (
            <nav
              aria-label="Sections de la charte"
              className="hidden lg:block w-56 shrink-0 border-r border-slate-100 dark:border-dark-border px-4 py-8 transition-colors duration-300"
            >
              <ul className="space-y-0.5">
                {SECTIONS.map((s) => {
                  const isActive = activeSection === s.id;
                  return (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(s.id)}
                        className={`w-full flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
                          isActive
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-medium'
                            : 'text-slate-500 dark:text-dark-text-secondary hover:bg-slate-50 dark:hover:bg-dark-surface hover:text-slate-700 dark:hover:text-dark-text'
                        }`}
                      >
                        <span className="tabular-nums text-[11px] opacity-70">{s.number}</span>
                        <span className="truncate">{s.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          <div className="relative flex-1 min-w-0 p-6 sm:p-9">
            <div
              ref={scrollContainerRef}
              className="relative h-[320px] sm:h-[420px] overflow-y-auto pr-4 -mr-4 scroll-smooth"
              role="region"
              aria-label="Contenu de la charte d'engagement"
              tabIndex={0}
            >
              {isCustomContent ? content : <BuiltInCharter registerRef={registerRef} />}

              <AnimatePresence>
                {hasScrolledToBottom && (
                  <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3.5 py-2.5 rounded-lg mt-6 text-sm font-medium transition-colors duration-300"
                  >
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Vous avez lu toute la charte
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-1" />
            </div>

            {/* Voile indiquant qu'il reste du contenu à lire */}
            <div
              aria-hidden
              className={`pointer-events-none absolute bottom-6 sm:bottom-9 left-6 right-10 sm:left-9 h-14 bg-gradient-to-t from-white dark:from-dark-card to-transparent transition-opacity duration-200 ${
                hasScrolledToBottom ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>
        </div>

        {/* Pied : validation et actions */}
        <div className="px-6 sm:px-9 py-6 bg-slate-50/60 dark:bg-dark-surface/60 border-t border-slate-100 dark:border-dark-border transition-colors duration-300">
          <div className="space-y-5">
            <label
              className={`group flex items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                hasScrolledToBottom
                  ? 'border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card cursor-pointer hover:border-primary-300 dark:hover:border-primary-500'
                  : 'border-slate-200 dark:border-dark-border bg-slate-100/60 dark:bg-dark-surface/60 cursor-not-allowed'
              }`}
            >
              <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={!hasScrolledToBottom}
                  onChange={(e) => handleCheckboxChange(e.target.checked)}
                  className="peer sr-only"
                  aria-describedby="accept-description"
                />
                <span
                  className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-1 ${
                    isChecked
                      ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500'
                      : hasScrolledToBottom
                      ? 'border-slate-300 dark:border-dark-surface bg-white dark:bg-dark-card group-hover:border-primary-400 dark:group-hover:border-primary-500'
                      : 'border-slate-200 dark:border-dark-surface bg-slate-100 dark:bg-dark-surface'
                  }`}
                >
                  {isChecked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </span>
              </span>
              <div className="flex-1">
                <span
                  className={`text-[14px] font-medium ${
                    hasScrolledToBottom ? 'text-slate-900 dark:text-dark-text' : 'text-slate-400 dark:text-dark-text-secondary/60'
                  } transition-colors duration-300`}
                >
                  J'ai lu entièrement la charte d'engagement et j'accepte toutes les conditions
                  ci-dessus.
                </span>
                {!hasScrolledToBottom && (
                  <p id="accept-description" className="text-[13px] text-slate-400 dark:text-dark-text-secondary/70 mt-1 transition-colors duration-300">
                    Faites défiler jusqu'en bas pour activer cette case.
                  </p>
                )}
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 transition-colors duration-300">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-dark-text-secondary/70 transition-colors duration-300">
                  Date
                </p>
                <p className="text-[14px] font-medium text-slate-900 dark:text-dark-text mt-0.5 transition-colors duration-300">{currentDate}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 py-3 transition-colors duration-300">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-dark-text-secondary/70 transition-colors duration-300">
                  Nom de l'étudiant
                </p>
                <p className="text-[14px] font-medium text-slate-900 dark:text-dark-text mt-0.5 transition-colors duration-300">
                  {studentName || 'Non renseigné'}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-1">
              {showAcceptButton && (
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={isAcceptDisabled}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-primary-600 dark:bg-primary-500 text-[14px] font-medium text-white transition-colors hover:bg-primary-700 dark:hover:bg-primary-600 disabled:opacity-40 disabled:hover:bg-primary-600 dark:disabled:hover:bg-primary-500 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 shadow-sm dark:shadow-soft-dark"
                >
                  {acceptButtonText}
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}