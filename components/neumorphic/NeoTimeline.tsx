'use client';

import React from 'react';
import {
  Lock,
  Unlock,
  AlertTriangle,
  ShieldCheck,
  Smartphone,
  Moon,
  Sun,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { SecurityEvent } from '@/lib/types';
import { NeoCard } from './NeoCard';
import { NeoSecurityBadge } from './NeoSecurityBadge';
import { NeoButton } from './NeoButton';

interface NeoTimelineProps {
  events: SecurityEvent[];
  onPromptWasThisYou?: (event: SecurityEvent) => void;
}

export const NeoTimeline: React.FC<NeoTimelineProps> = ({
  events,
  onPromptWasThisYou,
}) => {
  const getEventIcon = (type: string, severity: string) => {
    switch (type) {
      case 'suspicious_unlock':
        return <ShieldAlert className="w-4 h-4 text-security-danger" />;
      case 'unlock':
        return <Unlock className="w-4 h-4 text-amber-500" />;
      case 'lock':
      case 'remote_lock_ack':
        return <Lock className="w-4 h-4 text-emerald-600" />;
      case 'wake':
        return <Sun className="w-4 h-4 text-palette-charcoal" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-palette-ash" />;
      case 'device_paired':
        return <Smartphone className="w-4 h-4 text-palette-black dark:text-white" />;
      default:
        return severity === 'high' ? (
          <AlertTriangle className="w-4 h-4 text-security-danger" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-palette-ash" />
        );
    }
  };

  return (
    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-palette-sand dark:before:bg-[#3E3B3A]">
      {events.map((evt) => {
        const isSuspicious = evt.event_type === 'suspicious_unlock' && !evt.is_resolved;
        const timeStr = new Date(evt.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={evt.id} className="relative group">
            {/* Timeline Node Icon Indicator */}
            <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-palette-white dark:bg-[#222020] border border-palette-sand dark:border-[#3E3B3A] shadow-editorial-sm flex items-center justify-center z-10">
              {getEventIcon(evt.event_type, evt.severity)}
            </div>

            <NeoCard
              variant="flat"
              glow={isSuspicious ? 'danger' : 'none'}
              className="p-4 transition-all duration-200 hover:border-palette-ash"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-palette-ash">
                    {timeStr}
                  </span>
                  <h5 className="font-heading text-base tracking-wide text-palette-black dark:text-white">
                    {evt.title}
                  </h5>
                  {evt.device_name && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-palette-sand-light dark:bg-[#1A1919] text-palette-charcoal dark:text-palette-sand font-bold border border-palette-sand/60">
                      {evt.device_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <NeoSecurityBadge status={evt.risk_score} size="sm" />
                </div>
              </div>

              <p className="text-xs font-sans text-palette-charcoal dark:text-palette-sand mb-2 leading-relaxed">{evt.description}</p>

              {/* Suspicious Action Trigger */}
              {isSuspicious && onPromptWasThisYou && (
                <div className="mt-3 pt-2.5 border-t border-rose-200 dark:border-rose-900/40 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-security-danger flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Action Required: Was this you?
                  </span>
                  <NeoButton
                    variant="danger"
                    size="sm"
                    onClick={() => onPromptWasThisYou(evt)}
                    leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
                  >
                    Review Incident
                  </NeoButton>
                </div>
              )}

              {evt.is_resolved && evt.resolution_action && (
                <div className="mt-2 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Resolved: {evt.resolution_action === 'confirmed_legitimate' ? 'Confirmed by owner' : 'Remote locked'}
                </div>
              )}
            </NeoCard>
          </div>
        );
      })}
    </div>
  );
};
