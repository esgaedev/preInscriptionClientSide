import { useCallback, useId, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  compressImageToDataUrl,
} from '@/utils/imageCompression';

interface UploadProps {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  error?: string;
  hint?: string;
}

export function Upload({ label, value, onChange, error, hint }: UploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string>();

  const processFile = useCallback(
    async (file: File | undefined) => {
      setLocalError(undefined);
      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setLocalError('Formats acceptés : JPEG, PNG, WebP.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        setLocalError("L'image ne doit pas dépasser 5 Mo.");
        return;
      }

      setIsProcessing(true);
      try {
        const dataUrl = await compressImageToDataUrl(file);
        onChange(dataUrl);
      } catch {
        setLocalError("Impossible de traiter cette image. Réessayez avec un autre fichier.");
      } finally {
        setIsProcessing(false);
      }
    },
    [onChange],
  );

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void processFile(event.dataTransfer.files?.[0]);
  };

  const displayedError = error ?? localError;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink dark:text-dark-text transition-colors duration-300">
        {label}
      </label>

      {value ? (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card p-3 transition-colors duration-300">
          <img
            src={value}
            alt="Aperçu de la photo d'identité"
            className="h-20 w-20 rounded-xl object-cover shadow-sm"
          />
          <div className="flex-1 text-sm text-ink-soft/80 dark:text-dark-text-secondary/80 transition-colors duration-300">Photo prête à être envoyée.</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border border-slate-200 dark:border-dark-border p-2 text-ink-soft dark:text-dark-text-secondary transition-colors hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-700 dark:hover:text-primary-400"
              aria-label="Remplacer la photo"
            >
              <ImagePlus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="rounded-lg border border-slate-200 dark:border-dark-border p-2 text-ink-soft dark:text-dark-text-secondary transition-colors hover:border-red-300 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Supprimer la photo"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          animate={{ scale: isDragging ? 1.01 : 1 }}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors duration-300 ${
            isDragging
              ? 'border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-slate-300 dark:border-dark-border bg-slate-50 dark:bg-dark-surface/60 hover:border-primary-300 dark:hover:border-primary-500'
          }`}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
          }}
        >
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary-500 dark:text-primary-400" aria-hidden="true" />
          ) : (
            <UploadCloud className="h-8 w-8 text-primary-400 dark:text-primary-400" aria-hidden="true" />
          )}
          <p className="text-sm font-medium text-ink dark:text-dark-text transition-colors duration-300">
            Glissez-déposez votre photo ici, ou{' '}
            <span className="text-primary-600 dark:text-primary-400 underline">parcourez vos fichiers</span>
          </p>
          <p className="text-xs text-ink-soft/60 dark:text-dark-text-secondary/60 transition-colors duration-300">JPEG, PNG ou WebP — 5 Mo max</p>
        </motion.div>
      )}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        className="sr-only"
        onChange={(event) => void processFile(event.target.files?.[0])}
      />

      {hint && !displayedError && <p className="mt-1.5 text-xs text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">{hint}</p>}
      <ErrorMessage message={displayedError} />
    </div>
  );
}
