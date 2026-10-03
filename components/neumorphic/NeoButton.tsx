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
    lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5',
    xl: 'px-8 py-3.5 text-base sm:text-lg font-bold rounded-2xl gap-3',
  };

  const variantStyles = {
    // Primary - Apple Royal Blue
    primary:
      'bg-primary hover:bg-primary-hover text-white shadow-neu-button hover:opacity-95 active:scale-[0.98] transition-all font-heading tracking-tight',
    // Secondary - Alpine Titanium Card Style (High Contrast)
    secondary:
      'bg-surface dark:bg-[#242735] text-on-surface dark:text-white shadow-neu-raised-sm hover:bg-surface-container dark:hover:bg-[#2C3042] active:scale-[0.98] font-heading font-bold border border-outline-variant dark:border-[#383A4A]',
    // Danger - Apple Coral Red
    danger:
      'bg-error hover:bg-[#D70015] text-white shadow-sm hover:opacity-95 active:scale-[0.98] transition-all font-heading font-bold tracking-tight',
    // Warning - Apple Amber
    warning:
      'bg-tertiary hover:bg-tertiary-hover text-white font-heading font-bold shadow-sm active:scale-[0.98]',
    // Ghost - Flat with crisp contrast
    ghost:
      'bg-transparent text-on-surface-variant hover:text-on-surface dark:text-titanium-300 dark:hover:text-white hover:bg-surface-container dark:hover:bg-[#242735] font-sans font-semibold',
    // Inset - Sunken
    inset:
      'bg-surface-container-low dark:bg-[#14151D] text-on-surface dark:text-white shadow-neu-recessed font-bold border border-outline-variant/50',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer',
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
