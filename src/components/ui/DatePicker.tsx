import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from './Input';

interface DatePickerProps {
  label: string;
  /** Stored value in ISO format ("YYYY-MM-DD"), or '' when empty/incomplete. */
  value: string;
  onChange: (isoValue: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  hint?: string;
  name?: string;
}

function isoToDisplay(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
}

function displayToIso(display: string): string {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return '';
  const [, d, m, y] = match;
  return `${y}-${m}-${d}`;
}

/** Inserts "/" separators as the user types raw digits: 12022000 → 12/02/2000. */
function maskDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('/');
}

/**
 * A plain, masked text field for dates ("jj/mm/aaaa") — deliberately not a
 * native `type="date"` input, which opens an OS/browser calendar picker.
 * Stores/emits the value as ISO ("YYYY-MM-DD") so the rest of the form and
 * the API payload never need to know about the display format.
 */
export function DatePicker({ label, value, onChange, onBlur, error, required, hint, name }: DatePickerProps) {
  const [display, setDisplay] = useState(() => isoToDisplay(value));

  // Keep the visible text in sync if the ISO value changes from outside
  // (e.g. a draft being restored) without fighting the user's own typing.
  useEffect(() => {
    setDisplay((current) => (displayToIso(current) === value ? current : isoToDisplay(value)));
  }, [value]);

  return (
    <Input
      label={label}
      name={name}
      required={required}
      hint={hint}
      error={error}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="jj/mm/aaaa"
      maxLength={10}
      icon={<Calendar className="h-4 w-4" />}
      value={display}
      onChange={(event) => {
        const masked = maskDateInput(event.target.value);
        setDisplay(masked);
        onChange(displayToIso(masked));
      }}
      onBlur={onBlur}
    />
  );
}
