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
    raised: 'bg-surface dark:bg-[#191b24] shadow-neu-raised border border-outline-variant/30 dark:border-[#383a47]',
    flat: 'bg-surface dark:bg-[#191b24] shadow-neu-raised-sm border border-outline-variant/20 dark:border-[#2d2f3a]',
    inset: 'bg-surface-container-lowest dark:bg-[#14151d] shadow-neu-recessed border border-outline-variant/20 dark:border-[#282b3a]',
    floating: 'bg-surface dark:bg-[#191b24] shadow-neu-raised-lg border border-outline-variant/40 dark:border-[#383a47]',
  };

  const glowStyles = {
    none: '',
    secure: 'ring-2 ring-secondary-container/40 glow-emerald',
    warning: 'ring-2 ring-tertiary-container/40 glow-amber',
    danger: 'ring-2 ring-error/50 glow-coral animate-pulse',
    accent: 'ring-2 ring-primary-container/40 glow-cobalt',
  };

  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-neu-raised-lg cursor-pointer'
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
