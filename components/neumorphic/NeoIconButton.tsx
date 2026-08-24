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
    md: 'w-11 h-11 rounded-2xl p-2.5 text-base',
    lg: 'w-14 h-14 rounded-2xl p-3.5 text-xl',
  };

  const variantStyles = {
    raised: active
      ? 'bg-[#E0E8F2] dark:bg-[#0E1628] text-pulse-blue shadow-neo-pressed dark:shadow-neo-dark-pressed'
      : 'bg-surface-card dark:bg-surface-darkcard text-slate-700 dark:text-slate-200 shadow-neo-flat dark:shadow-neo-dark-flat hover:shadow-neo-raised dark:hover:shadow-neo-dark-raised active:shadow-neo-pressed border border-white/70 dark:border-white/10',
    flat: 'bg-surface-card dark:bg-surface-darkcard text-slate-700 dark:text-slate-200 shadow-neo-sm hover:shadow-neo-flat border border-white/60 dark:border-white/5',
    inset: 'bg-[#E0E8F2] dark:bg-[#0E1628] text-pulse-blue shadow-neo-pressed dark:shadow-neo-dark-pressed border border-slate-300/40 dark:border-white/5',
    danger: 'bg-red-500 text-white shadow-neo-raised hover:shadow-glow-danger active:scale-95 border border-red-400/40',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-pulse-cyan',
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
