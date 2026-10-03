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
  const normalized = (status || 'secure').toLowerCase();

  let config = {
    colorClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60',
    dotClass: 'bg-secondary glow-emerald',
    icon: ShieldCheck,
    defaultLabel: 'ALL SECURE',
  };

  if (normalized === 'warning' || normalized === 'medium') {
    config = {
      colorClass: 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300 dark:border-amber-800/60',
      dotClass: 'bg-tertiary glow-amber',
      icon: AlertTriangle,
      defaultLabel: 'WARNING',
    };
  } else if (normalized === 'danger' || normalized === 'high' || normalized === 'critical') {
    config = {
      colorClass: 'bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-300 border-red-300 dark:border-red-800/60',
      dotClass: 'bg-error glow-coral animate-ping',
      icon: ShieldAlert,
      defaultLabel: 'CRITICAL RISK',
    };
  } else if (normalized === 'locked') {
    config = {
      colorClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800/60 dark:text-slate-200 border-slate-300 dark:border-slate-700',
      dotClass: 'bg-slate-500',
      icon: Lock,
      defaultLabel: 'OS LOCKED',
    };
  } else if (normalized === 'info' || normalized === 'unknown') {
    config = {
      colorClass: 'bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 border-blue-300 dark:border-blue-800/60',
      dotClass: 'bg-primary glow-azure',
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
          'inline-flex items-center font-heading font-bold tracking-wider uppercase rounded-full border shadow-sm select-none',
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
