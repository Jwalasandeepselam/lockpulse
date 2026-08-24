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
    colorClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-500 shadow-glow-secure',
    icon: ShieldCheck,
    defaultLabel: 'SECURE',
  };

  if (normalized === 'warning' || normalized === 'medium') {
    config = {
      colorClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dotClass: 'bg-amber-500 shadow-glow-warning',
      icon: AlertTriangle,
      defaultLabel: 'WARNING',
    };
  } else if (normalized === 'danger' || normalized === 'high' || normalized === 'critical') {
    config = {
      colorClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      dotClass: 'bg-rose-500 shadow-glow-danger animate-ping',
      icon: ShieldAlert,
      defaultLabel: 'CRITICAL RISK',
    };
  } else if (normalized === 'locked') {
    config = {
      colorClass: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
      dotClass: 'bg-slate-500',
      icon: Lock,
      defaultLabel: 'LOCKED',
    };
  } else if (normalized === 'info' || normalized === 'unknown') {
    config = {
      colorClass: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30',
      dotClass: 'bg-sky-500',
      icon: Info,
      defaultLabel: 'INFO',
    };
  }

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px] gap-1.5',
    md: 'px-3.5 py-1 text-xs gap-2',
    lg: 'px-4.5 py-1.5 text-sm gap-2.5',
  };

  const IconComponent = config.icon;

  return (
    <div
      className={twMerge(
        clsx(
          'inline-flex items-center font-heading font-bold rounded-full border shadow-neo-sm backdrop-blur-sm tracking-wide select-none',
          config.colorClass,
          sizeStyles[size],
          className
        )
      )}
    >
      <span className={clsx('w-2 h-2 rounded-full', config.dotClass)} />
      {showIcon && <IconComponent className={clsx(size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />}
      <span>{label || config.defaultLabel}</span>
    </div>
  );
};
