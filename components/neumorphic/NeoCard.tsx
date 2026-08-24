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
    raised: 'bg-palette-white dark:bg-[#222020] border border-palette-sand dark:border-[#3E3B3A] shadow-editorial-md',
    flat: 'bg-palette-white dark:bg-[#222020] border border-palette-sand/70 dark:border-[#3E3B3A] shadow-editorial-sm',
    inset: 'bg-palette-sand-light/60 dark:bg-[#141313] border border-palette-sand dark:border-[#2F2D2D] shadow-editorial-inset',
    floating: 'bg-palette-white dark:bg-[#222020] border border-palette-sand dark:border-[#3E3B3A] shadow-editorial-lg',
  };

  const glowStyles = {
    none: '',
    secure: 'ring-2 ring-emerald-500/40 shadow-glow-secure',
    warning: 'ring-2 ring-amber-500/40 shadow-glow-warning',
    danger: 'ring-2 ring-red-500/50 shadow-glow-danger animate-pulse',
    accent: 'ring-2 ring-palette-charcoal/30 shadow-glow-accent',
  };

  const hoverStyles = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-editorial-hover cursor-pointer'
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
