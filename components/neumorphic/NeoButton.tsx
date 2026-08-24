'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'ghost' | 'inset';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5',
    xl: 'px-8 py-4.5 text-lg font-bold rounded-2xl gap-3',
  };

  const variantStyles = {
    // Primary - High-visibility Electric Cyan/Blue
    primary:
      'bg-gradient-to-r from-pulse-blue to-pulse-cyan text-white shadow-neo-raised hover:shadow-glow-accent hover:brightness-105 active:scale-[0.98] border border-pulse-sky/30',
    // Secondary - Tactile Neumorphic Raised Surface
    secondary:
      'bg-surface-card dark:bg-surface-darkcard text-slate-800 dark:text-slate-100 shadow-neo-flat dark:shadow-neo-dark-flat hover:shadow-neo-raised dark:hover:shadow-neo-dark-raised active:shadow-neo-pressed dark:active:shadow-neo-dark-pressed border border-white/70 dark:border-white/10',
    // Danger - High contrast Lockdown / Revoke Red
    danger:
      'bg-gradient-to-r from-security-danger to-security-danger-dark text-white shadow-neo-raised hover:shadow-glow-danger hover:brightness-105 active:scale-[0.98] border border-red-400/40',
    // Warning - Amber
    warning:
      'bg-gradient-to-r from-security-warning to-security-warning-dark text-slate-950 font-bold shadow-neo-raised hover:shadow-glow-warning hover:brightness-105 active:scale-[0.98]',
    // Ghost - Subtle flat
    ghost:
      'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent',
    // Inset - Active/Toggled state
    inset:
      'bg-[#E2EAF2] dark:bg-[#0E1626] text-pulse-blue dark:text-pulse-sky shadow-neo-pressed dark:shadow-neo-dark-pressed border border-slate-300/60 dark:border-white/5 font-bold',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-heading transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-pulse-cyan focus-visible:ring-offset-2',
          sizeStyles[size],
          variantStyles[variant],
          (disabled || isLoading) && 'opacity-60 cursor-not-allowed pointer-events-none',
          className
        )
      )}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
