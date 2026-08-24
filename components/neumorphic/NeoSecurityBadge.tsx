'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ShieldCheck, AlertTriangle, ShieldAlert, Info, Lock } from 'lucide-react';
import { RiskScore, SecuritySeverity } from '@/lib/types';

interface NeoSecurityBadgeProps {
  status: 'secure' | 'warning' | 'danger' | 'info' | 'locked' | RiskScore | SecuritySeverity;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const NeoSecurityBadge: React.FC<NeoSecurityBadgeProps> = ({
  status,
  label,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const normalized = status.toLowerCase();

  let config = {
    colorClass: 'bg-secondary-container/20 text-secondary dark:text-secondary-fixed border-secondary-container/40',
    dotClass: 'bg-secondary glow-emerald',
    icon: ShieldCheck,
    defaultLabel: 'ALL SECURE',
  };

  if (normalized === 'warning' || normalized === 'medium') {
    config = {
      colorClass: 'bg-tertiary-container/20 text-tertiary dark:text-tertiary-fixed border-tertiary-container/40',
      dotClass: 'bg-tertiary-container glow-amber',
      icon: AlertTriangle,
      defaultLabel: 'WARNING',
    };
  } else if (normalized === 'danger' || normalized === 'high' || normalized === 'critical') {
    config = {
      colorClass: 'bg-error-container/40 text-error dark:text-error-container border-error/30',
      dotClass: 'bg-error glow-coral animate-ping',
      icon: ShieldAlert,
      defaultLabel: 'CRITICAL RISK',
    };
  } else if (normalized === 'locked') {
    config = {
      colorClass: 'bg-surface-container text-on-surface-variant border-outline-variant/50',
      dotClass: 'bg-outline',
      icon: Lock,
      defaultLabel: 'OS LOCKED',
    };
  } else if (normalized === 'info' || normalized === 'unknown') {
    config = {
      colorClass: 'bg-primary-fixed/30 text-primary dark:text-primary-fixed border-primary-fixed/50',
      dotClass: 'bg-primary glow-cobalt',
      icon: Info,
      defaultLabel: 'INFO',
    };
  }

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px] gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
    lg: 'px-4 py-1.5 text-sm gap-2.5',
  };

  const IconComponent = config.icon;

  return (
    <div
      className={twMerge(
        clsx(
          'inline-flex items-center font-heading font-bold tracking-wider uppercase rounded-full border shadow-neu-raised-sm select-none',
          config.colorClass,
          sizeStyles[size],
          className
        )
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full', config.dotClass)} />
      {showIcon && <IconComponent className={clsx(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />}
      <span>{label || config.defaultLabel}</span>
    </div>
  );
};
