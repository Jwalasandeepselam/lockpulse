'use client';

import React from 'react';
import { clsx } from 'clsx';

interface NeoToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const NeoToggle: React.FC<NeoToggleProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={clsx('flex items-center justify-between gap-4 py-2 select-none', className)}>
      {(label || description) && (
        <div className="flex flex-col flex-1 cursor-pointer" onClick={() => !disabled && onChange(!checked)}>
          {label && (
            <span className="font-heading font-bold text-sm text-on-surface dark:text-white tracking-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="font-sans text-xs text-on-surface-variant dark:text-titanium-400 mt-0.5 leading-relaxed">
              {description}
            </span>
          )}
        </div>
      )}

      {/* Accessible Switch Control */}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || 'Toggle switch'}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onClick={() => onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={clsx(
          'relative w-14 h-8 rounded-full p-1 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex-shrink-0 cursor-pointer',
          checked
            ? 'bg-secondary dark:bg-secondary-container shadow-neu-button'
            : 'bg-surface-container dark:bg-[#1E212B] shadow-neu-recessed border border-outline-variant dark:border-[#282B38]',
          disabled && 'opacity-40 cursor-not-allowed'
        )}
      >
        <span
          className={clsx(
            'block w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300',
            checked ? 'translate-x-6' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
