'use client';

import React, { forwardRef, useId } from 'react';
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
  ({ label, error, helperText, leftIcon, rightIcon, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || (label ? `input-${generatedId}` : undefined);
    const errorId = error ? `error-${generatedId}` : undefined;
    const helperId = helperText ? `helper-${generatedId}` : undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-heading font-bold uppercase tracking-wider text-xs text-on-surface dark:text-white"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-on-surface-variant pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={twMerge(
              clsx(
                'w-full bg-surface-container-lowest dark:bg-[#14151d] text-on-surface dark:text-white placeholder:text-on-surface-variant/60 rounded-xl px-4 py-3 text-sm font-sans transition-all duration-200 outline-none border border-outline-variant/40 dark:border-[#383a47] shadow-neu-recessed focus:border-primary focus:ring-1 focus:ring-primary',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-error focus:ring-error',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-on-surface-variant flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span id={errorId} className="text-xs font-semibold text-error font-sans">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="text-xs text-on-surface-variant font-sans">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

NeoInput.displayName = 'NeoInput';
