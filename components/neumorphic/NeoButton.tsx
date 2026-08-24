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
    sm: 'px-3.5 py-1.5 text-xs font-bold rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm font-bold rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-xl gap-2.5',
    xl: 'px-8 py-4.5 text-lg font-bold rounded-2xl gap-3',
  };

  const variantStyles = {
    // Primary - Deep Obsidian Black with white text
    primary:
      'bg-palette-black hover:bg-palette-charcoal dark:bg-palette-white dark:hover:bg-palette-sand dark:text-palette-black text-white shadow-editorial-md hover:shadow-editorial-hover active:scale-[0.98] transition-all tracking-wide uppercase font-heading',
    // Secondary - Clean Editorial White with sand border
    secondary:
      'bg-palette-white dark:bg-[#2A2828] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#4A4747] shadow-editorial-sm hover:border-palette-ash hover:text-palette-black dark:hover:text-white active:scale-[0.98] font-sans font-semibold',
    // Danger - High contrast Lockdown Red
    danger:
      'bg-security-danger hover:bg-security-danger-dark text-white shadow-editorial-md hover:shadow-glow-danger active:scale-[0.98] transition-all tracking-wide uppercase font-heading',
    // Warning - Amber
    warning:
      'bg-security-warning hover:bg-security-warning-dark text-palette-black font-bold shadow-editorial-md active:scale-[0.98]',
    // Ghost - Subtle flat
    ghost:
      'bg-transparent text-palette-ash hover:text-palette-black dark:hover:text-white hover:bg-palette-sand/40 dark:hover:bg-[#2A2828] font-sans font-medium',
    // Inset - Active state
    inset:
      'bg-palette-sand-light dark:bg-[#141313] text-palette-black dark:text-white border border-palette-sand shadow-editorial-inset font-bold',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-palette-charcoal',
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
