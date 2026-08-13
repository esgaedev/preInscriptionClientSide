import { forwardRef, useState, useRef, useEffect, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';

interface AutocompleteOption {
  value: string;
  label: string;
}

interface AutocompleteProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options?: AutocompleteOption[];
  storageKey?: string;
  placeholder?: string;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  ({ 
    label, 
    error, 
    hint, 
    icon, 
    required, 
    value, 
    onChange, 
    options = [], 
    storageKey,
    placeholder = 'Tapez pour rechercher...',
    id, 
    className = '', 
    ...rest 
  }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load history from localStorage
    const loadHistory = (): string[] => {
      if (!storageKey) return [];
      try {
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    };

    // Save to localStorage
    const saveToHistory = (newValue: string) => {
      if (!storageKey || !newValue.trim()) return;
      const history = loadHistory();
      const updated = [newValue, ...history.filter(item => item !== newValue)].slice(0, 50);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    // Combine static options with history
    const getAllOptions = (): AutocompleteOption[] => {
      const history = loadHistory();
      const historyOptions = history
        .filter(item => !options.some(opt => opt.value === item))
        .map(item => ({ value: item, label: item }));
      return [...historyOptions, ...options];
    };

    useEffect(() => {
      if (isOpen) {
        const allOptions = getAllOptions();
        const filtered = value
          ? allOptions.filter(opt => 
              opt.label.toLowerCase().includes(value.toLowerCase())
            )
          : allOptions;
        setFilteredOptions(filtered);
        setHighlightedIndex(-1);
      }
    }, [value, isOpen, options]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      setIsOpen(true);
    };

    const handleSelectOption = (option: AutocompleteOption) => {
      onChange(option.value);
      saveToHistory(option.value);
      setIsOpen(false);
      inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          } else {
            saveToHistory(value);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        case 'Tab':
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelectOption(filteredOptions[highlightedIndex]);
          } else {
            saveToHistory(value);
            setIsOpen(false);
          }
          break;
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Save to history when leaving the field
      if (value.trim()) {
        saveToHistory(value);
      }
      rest.onBlur?.(e);
    };

    return (
      <div className="w-full" ref={containerRef}>
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink dark:text-dark-text transition-colors duration-300">
          {label}
          {required && <span className="text-secondary-600 dark:text-secondary-400 ml-0.5">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft/60 dark:text-dark-text-secondary/60 transition-colors duration-300">
              {icon}
            </span>
          )}
          <input
            ref={(node) => {
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
              inputRef.current = node;
            }}
            id={inputId}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            aria-invalid={Boolean(error)}
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={`${inputId}-listbox`}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-white dark:bg-dark-card px-4 py-2.5 text-sm text-ink dark:text-dark-text shadow-sm dark:shadow-soft-dark transition-all placeholder:text-slate-400 dark:placeholder:text-dark-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-secondary-400/60 dark:focus:ring-primary-400/60 ${
              icon ? 'pl-10' : ''
            } pr-10 ${
              error
                ? 'border-red-400 focus:border-red-500 dark:border-red-500 dark:focus:border-red-600'
                : 'border-slate-200 dark:border-dark-border focus:border-primary-400 dark:focus:border-primary-500'
            } ${className}`}
            {...rest}
          />
          <ChevronDown
            className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-soft/60 dark:text-dark-text-secondary/60 transition-colors duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
          {isOpen && filteredOptions.length > 0 && (
            <ul
              id={`${inputId}-listbox`}
              role="listbox"
              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card shadow-lg dark:shadow-soft-dark py-1"
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => handleSelectOption(option)}
                  className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                    highlightedIndex === index
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-ink dark:text-dark-text hover:bg-slate-50 dark:hover:bg-dark-surface'
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-xs text-ink-soft/70 dark:text-dark-text-secondary/70 transition-colors duration-300">
            {hint}
          </p>
        )}
        <ErrorMessage id={errorId} message={error} />
      </div>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
