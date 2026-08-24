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
    lg: 'px-6 py-3.5 text-base font-bold rounded-xl gap-2.5',
    xl: 'px-8 py-4 text-lg font-bold rounded-2xl gap-3',
  };

  const variantStyles = {
    // Primary - Electric Cobalt Blue
    primary:
      'bg-primary hover:bg-[#0035be] dark:bg-primary-container text-white shadow-neu-button hover:opacity-95 active:scale-[0.98] transition-all font-heading tracking-tight',
    // Secondary - Tactile Surface Neumorphic Raised
    secondary:
      'bg-surface dark:bg-[#232530] text-primary dark:text-primary-fixed shadow-neu-raised-sm hover:opacity-90 active:scale-[0.98] font-heading border border-outline-variant/30 dark:border-[#383a47]',
    // Danger - Coral / Crimson Error
    danger:
      'bg-error hover:bg-[#93000a] text-white shadow-[4px_4px_10px_rgba(186,26,26,0.35),-4px_-4px_10px_rgba(255,255,255,0.7)] active:scale-[0.98] transition-all font-heading tracking-tight',
    // Warning - Amber
    warning:
      'bg-tertiary-container hover:bg-tertiary text-on-tertiary-container font-heading shadow-neu-raised-sm active:scale-[0.98]',
    // Ghost - Flat
    ghost:
      'bg-transparent text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed hover:bg-surface-container dark:hover:bg-[#232530] font-sans font-medium',
    // Inset - Sunken
    inset:
      'bg-surface-container-low dark:bg-[#14151d] text-primary dark:text-white shadow-neu-recessed font-bold',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
