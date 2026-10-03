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
    sm: 'w-8 h-8 rounded-full p-1.5 text-sm',
    md: 'w-10 h-10 rounded-full p-2 text-base',
    lg: 'w-12 h-12 rounded-full p-3 text-xl',
  };

  const variantStyles = {
    raised: active
      ? 'bg-surface-container dark:bg-[#232530] text-primary dark:text-primary-fixed shadow-neu-recessed border border-outline-variant/30'
      : 'bg-surface dark:bg-[#191b24] text-primary dark:text-primary-fixed shadow-neu-raised-sm border border-outline-variant/30 hover:scale-105 active:scale-95',
    flat: 'bg-surface dark:bg-[#191b24] text-on-surface-variant hover:text-primary border border-outline-variant/20 hover:border-primary',
    inset: 'bg-surface-container dark:bg-[#14151d] text-primary shadow-neu-recessed border border-outline-variant/30',
    danger: 'bg-error text-white shadow-neu-button hover:bg-[#93000a] active:scale-95',
    ghost: 'bg-transparent text-on-surface-variant hover:text-primary hover:bg-surface-container',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
