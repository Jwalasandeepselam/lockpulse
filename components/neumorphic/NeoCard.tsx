'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'raised' | 'flat' | 'inset' | 'floating';
  glow?: 'none' | 'secure' | 'warning' | 'danger' | 'accent';
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  variant = 'raised',
  glow = 'none',
  hoverEffect = false,
  className,
  children,
  ...props
}) => {
  const variantStyles = {
    raised: 'bg-surface-card dark:bg-surface-darkcard shadow-neo-raised dark:shadow-neo-dark-raised border border-white/60 dark:border-white/5',
    flat: 'bg-surface-card dark:bg-surface-darkcard shadow-neo-flat dark:shadow-neo-dark-flat border border-white/50 dark:border-white/5',
    inset: 'bg-[#E5ECF4] dark:bg-[#0D1524] shadow-neo-pressed dark:shadow-neo-dark-pressed border border-slate-300/40 dark:border-white/5',
    floating: 'bg-surface-card dark:bg-surface-darkcard shadow-neo-floating dark:shadow-neo-dark-raised border border-white/70 dark:border-white/10',
  };

  const glowStyles = {
    none: '',
    secure: 'shadow-glow-secure ring-2 ring-security-secure/40',
    warning: 'shadow-glow-warning ring-2 ring-security-warning/40',
    danger: 'shadow-glow-danger ring-2 ring-security-danger/50 animate-pulse-glow',
    accent: 'shadow-glow-accent ring-2 ring-pulse-cyan/40',
  };

  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-neo-floating dark:hover:shadow-neo-dark-raised cursor-pointer'
    : '';

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl p-6 transition-all duration-200',
          variantStyles[variant],
          glowStyles[glow],
          hoverStyles,
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
