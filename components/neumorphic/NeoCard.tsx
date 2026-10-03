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
    raised: 'bg-surface dark:bg-[#16181F] shadow-neu-raised border border-outline-variant/60 dark:border-[#282B38]',
    flat: 'bg-surface dark:bg-[#16181F] shadow-neu-raised-sm border border-outline-variant/40 dark:border-[#282B38]',
    inset: 'bg-surface-container-lowest dark:bg-[#0D0E12] shadow-neu-recessed border border-outline-variant/40 dark:border-[#242735]',
    floating: 'bg-surface dark:bg-[#16181F] shadow-neu-raised-lg border border-outline-variant/70 dark:border-[#383A4A]',
  };

  const glowStyles = {
    none: '',
    secure: 'ring-2 ring-secondary/40 glow-emerald',
    warning: 'ring-2 ring-tertiary/40 glow-amber',
    danger: 'ring-2 ring-error/50 glow-coral animate-pulse',
    accent: 'ring-2 ring-primary/40 glow-azure',
  };

  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-neu-raised-lg cursor-pointer'
    : '';

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl p-6 transition-all duration-200 text-on-surface dark:text-white',
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
