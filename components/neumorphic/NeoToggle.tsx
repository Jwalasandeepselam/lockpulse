'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  return (
    <label
      className={twMerge(
        clsx(
          'flex items-center justify-between gap-4 cursor-pointer select-none',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )
      )}
    >
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="font-heading font-medium text-sm text-slate-800 dark:text-slate-200">{label}</span>}
          {description && <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>}
        </div>
      )}
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative w-14 h-8 rounded-full transition-colors duration-300 p-1 flex items-center',
          checked
            ? 'bg-gradient-to-r from-pulse-blue to-pulse-cyan shadow-glow-accent'
            : 'bg-[#DCE4EE] dark:bg-[#0E1524] shadow-neo-pressed dark:shadow-neo-dark-pressed border border-slate-300/40 dark:border-white/5'
        )}
      >
        <div
          className={clsx(
            'w-6 h-6 rounded-full bg-white shadow-neo-raised transition-transform duration-300 transform',
            checked ? 'translate-x-6' : 'translate-x-0'
          )}
        />
      </div>
    </label>
  );
};
