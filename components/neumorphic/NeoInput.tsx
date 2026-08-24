'use client';

import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const NeoInput = forwardRef<HTMLInputElement, NeoInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="font-heading tracking-wider uppercase text-xs text-palette-charcoal dark:text-palette-sand">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-palette-ash pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-palette-white dark:bg-[#1A1919] text-palette-black dark:text-palette-white placeholder:text-palette-ash/60 rounded-xl px-4 py-3 text-sm font-sans transition-all duration-200 outline-none border border-palette-sand dark:border-[#3E3B3A] shadow-editorial-inset focus:border-palette-black dark:focus:border-palette-white focus:ring-1 focus:ring-palette-black',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-security-danger focus:ring-security-danger',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-palette-ash flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-semibold text-security-danger">{error}</span>}
        {!error && helperText && <span className="text-xs text-palette-ash">{helperText}</span>}
      </div>
    );
  }
);

NeoInput.displayName = 'NeoInput';
