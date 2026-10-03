'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { NeoIconButton } from './NeoIconButton';

interface NeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NeoModal: React.FC<NeoModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={subtitle ? 'modal-subtitle' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-md transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        ref={modalRef}
        className={clsx(
          'relative z-10 w-full bg-surface dark:bg-[#191b24] rounded-[2rem] p-6 sm:p-8 shadow-neu-raised-lg border border-outline-variant/30 animate-scaleUp',
          maxWidthStyles[maxWidth]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 pb-3 border-b border-outline-variant/20">
          <div>
            <h3
              id="modal-title"
              className="font-heading font-bold text-xl sm:text-2xl text-on-surface dark:text-white tracking-tight"
            >
              {title}
            </h3>
            {subtitle && (
              <p
                id="modal-subtitle"
                className="font-sans text-xs text-on-surface-variant dark:text-[#c4c5d9] mt-0.5"
              >
                {subtitle}
              </p>
            )}
          </div>
          <NeoIconButton
            size="sm"
            variant="flat"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </NeoIconButton>
        </div>

        {/* Content Body */}
        <div className="text-on-surface dark:text-white">{children}</div>
      </div>
    </div>
  );
};
