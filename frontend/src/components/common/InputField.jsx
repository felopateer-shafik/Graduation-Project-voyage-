import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

/**
 * InputField — Styled form input matching the Voyage design system
 * @param {{ label?: string, icon?: string, error?: string, className?: string }} props
 */
const InputField = forwardRef(({ label, icon, error, className = '', type = 'text', ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-xl">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'input-field',
            icon && 'pl-11',
            error && 'ring-2 ring-error/30 bg-error/5',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-error font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">error</span>
          {error}
        </p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';
export default InputField;
