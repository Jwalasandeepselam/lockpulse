'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PresenceStatus } from '@/lib/types';

interface NeoStatusIndicatorProps {
  status: 'online' | 'offline' | 'locked' | 'warning' | PresenceStatus;
  label?: string;
  className?: string;
}

export const NeoStatusIndicator: React.FC<NeoStatusIndicatorProps> = ({
  status,
  label,
  className,
}) => {
  let color = 'bg-slate-400';
  let ping = false;
  let text = label || status;

  switch (status) {
    case 'online':
    case 'nearby':
      color = 'bg-emerald-500 shadow-glow-secure';
      ping = true;
      text = label || (status === 'nearby' ? 'Owner Nearby' : 'Online');
      break;
    case 'away':
    case 'warning':
      color = 'bg-amber-500 shadow-glow-warning';
      text = label || (status === 'away' ? 'Owner Away' : 'Warning');
      break;
    case 'locked':
      color = 'bg-sky-500 shadow-glow-accent';
      text = label || 'Locked';
      break;
    case 'offline':
      color = 'bg-slate-400';
      text = label || 'Offline';
      break;
    case 'unknown':
      color = 'bg-slate-500';
      text = label || 'Proximity Unknown';
      break;
  }

  return (
    <div className={twMerge(clsx('inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300', className))}>
      <span className="relative flex h-2.5 w-2.5">
        {ping && (
          <span
            className={clsx(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              color
            )}
          />
        )}
        <span className={clsx('relative inline-flex rounded-full h-2.5 w-2.5', color)} />
      </span>
      <span className="capitalize">{text}</span>
    </div>
  );
};
