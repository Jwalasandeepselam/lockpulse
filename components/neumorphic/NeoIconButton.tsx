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
      ? 'bg-palette-sand-light dark:bg-[#323030] text-palette-black dark:text-white border border-palette-sand'
      : 'bg-palette-white dark:bg-[#222020] text-palette-charcoal dark:text-palette-sand shadow-editorial-sm border border-palette-sand dark:border-[#3E3B3A] hover:border-palette-ash hover:text-palette-black active:scale-95',
    flat: 'bg-palette-white dark:bg-[#222020] text-palette-charcoal dark:text-palette-sand border border-palette-sand/70 hover:border-palette-ash',
    inset: 'bg-palette-sand-light dark:bg-[#141313] text-palette-black border border-palette-sand',
    danger: 'bg-security-danger text-white hover:bg-security-danger-dark shadow-editorial-sm active:scale-95',
    ghost: 'bg-transparent text-palette-ash hover:text-palette-black hover:bg-palette-sand/30',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-palette-charcoal',
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
