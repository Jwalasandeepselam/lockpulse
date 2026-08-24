'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { NeoIconButton } from './NeoIconButton';
import { NeoCard } from './NeoCard';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Modal Dialog Card */}
      <div className={`relative w-full ${maxWidthStyles[maxWidth]} z-10 animate-scaleUp`}>
        <NeoCard variant="floating" className="p-6 md:p-8 bg-surface-card dark:bg-surface-darkcard border border-white/80 dark:border-white/10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
            </div>
            <NeoIconButton size="sm" variant="flat" onClick={onClose} aria-label="Close dialog">
              <X className="w-4 h-4" />
            </NeoIconButton>
          </div>

          <div className="space-y-4">{children}</div>
        </NeoCard>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};
