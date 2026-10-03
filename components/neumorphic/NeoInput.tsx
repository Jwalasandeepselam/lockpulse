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
            className="font-heading font-bold text-xs uppercase tracking-wider text-on-surface dark:text-white"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-on-surface-variant dark:text-titanium-400 pointer-events-none flex items-center justify-center">
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
                'w-full bg-surface-container-lowest dark:bg-[#0D0E12] text-on-surface dark:text-white placeholder:text-on-surface-variant/50 dark:placeholder:text-titanium-500 rounded-xl px-4 py-2.5 sm:py-3 text-sm font-sans transition-all duration-200 outline-none border border-outline-variant dark:border-[#282B38] shadow-neu-recessed focus:border-primary focus:ring-2 focus:ring-primary/20',
                leftIcon && 'pl-10',
                rightIcon && 'pr-10',
                error && 'border-error focus:border-error focus:ring-error/20',
                className
              )
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-on-surface-variant dark:text-titanium-400 flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span id={errorId} className="text-xs font-semibold text-error font-sans flex items-center gap-1 mt-0.5">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span id={helperId} className="text-xs text-on-surface-variant dark:text-titanium-400 font-sans mt-0.5">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

NeoInput.displayName = 'NeoInput';
