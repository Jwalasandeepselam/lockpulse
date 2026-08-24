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
    colorClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    dotClass: 'bg-emerald-500',
    icon: ShieldCheck,
    defaultLabel: 'SECURE',
  };

  if (normalized === 'warning' || normalized === 'medium') {
    config = {
      colorClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      dotClass: 'bg-amber-500',
      icon: AlertTriangle,
      defaultLabel: 'WARNING',
    };
  } else if (normalized === 'danger' || normalized === 'high' || normalized === 'critical') {
    config = {
      colorClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
      dotClass: 'bg-rose-500 animate-ping',
      icon: ShieldAlert,
      defaultLabel: 'CRITICAL RISK',
    };
  } else if (normalized === 'locked') {
    config = {
      colorClass: 'bg-palette-sand-light dark:bg-[#323030] text-palette-charcoal dark:text-palette-sand border-palette-sand dark:border-[#4A4747]',
      dotClass: 'bg-palette-ash',
      icon: Lock,
      defaultLabel: 'LOCKED',
    };
  } else if (normalized === 'info' || normalized === 'unknown') {
    config = {
      colorClass: 'bg-palette-sand-light/70 text-palette-charcoal dark:text-palette-sand border-palette-sand',
      dotClass: 'bg-palette-ash',
      icon: Info,
      defaultLabel: 'INFO',
    };
  }

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1.5',
    md: 'px-3 py-1 text-xs gap-2',
    lg: 'px-4 py-1.5 text-sm gap-2.5',
  };

  const IconComponent = config.icon;

  return (
    <div
      className={twMerge(
        clsx(
          'inline-flex items-center font-heading tracking-wider uppercase rounded-full border shadow-editorial-sm select-none',
          config.colorClass,
          sizeStyles[size],
          className
        )
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dotClass)} />
      {showIcon && <IconComponent className={clsx(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5')} />}
      <span>{label || config.defaultLabel}</span>
    </div>
  );
};
