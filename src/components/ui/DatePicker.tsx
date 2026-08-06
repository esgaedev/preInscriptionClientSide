import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from './Input';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
  return <Input ref={ref} type="date" icon={<Calendar className="h-4 w-4" />} {...props} />;
});

DatePicker.displayName = 'DatePicker';
