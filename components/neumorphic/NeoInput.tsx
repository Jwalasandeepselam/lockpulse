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
          <label className="font-heading font-medium text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-slate-500 dark:text-slate-400 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-[#E5ECF4] dark:bg-[#0E1628] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm transition-all duration-200 outline-none shadow-neo-pressed dark:shadow-neo-dark-pressed border border-slate-300/40 dark:border-white/5 focus:ring-2 focus:ring-pulse-cyan focus:border-transparent',
                leftIcon && 'pl-11',
                rightIcon && 'pr-11',
                error && 'ring-2 ring-security-danger border-transparent',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 text-slate-500 dark:text-slate-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs font-semibold text-security-danger">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>}
      </div>
    );
  }
);

NeoInput.displayName = 'NeoInput';
