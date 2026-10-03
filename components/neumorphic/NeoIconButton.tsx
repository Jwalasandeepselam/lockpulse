'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NeoIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'raised' | 'flat' | 'inset' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const NeoIconButton: React.FC<NeoIconButtonProps> = ({
  variant = 'raised',
  size = 'md',
  active = false,
  className,
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 rounded-xl p-1.5 text-sm',
    md: 'w-10 h-10 rounded-xl p-2 text-base',
    lg: 'w-12 h-12 rounded-2xl p-3 text-xl',
  };

  const variantStyles = {
    raised: active
      ? 'bg-surface-container dark:bg-[#242735] text-primary dark:text-white shadow-neu-recessed border border-outline-variant/60'
      : 'bg-surface dark:bg-[#16181F] text-on-surface dark:text-white shadow-neu-raised-sm border border-outline-variant/60 hover:scale-105 active:scale-95',
    flat: 'bg-surface dark:bg-[#16181F] text-on-surface-variant hover:text-on-surface dark:text-titanium-300 dark:hover:text-white border border-outline-variant/40 hover:border-primary/50',
    inset: 'bg-surface-container-low dark:bg-[#0D0E12] text-on-surface dark:text-white shadow-neu-recessed border border-outline-variant/40',
    danger: 'bg-error text-white shadow-sm hover:bg-[#D70015] active:scale-95',
    ghost: 'bg-transparent text-on-surface-variant hover:text-on-surface dark:text-titanium-300 dark:hover:text-white hover:bg-surface-container dark:hover:bg-[#242735]',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer',
          sizeStyles[size],
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
