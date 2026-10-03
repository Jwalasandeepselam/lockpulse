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
        return <ShieldAlert className="w-4 h-4 text-error" />;
      case 'unlock':
        return <Unlock className="w-4 h-4 text-tertiary-container" />;
      case 'lock':
      case 'remote_lock_ack':
        return <Lock className="w-4 h-4 text-secondary" />;
      case 'wake':
        return <Sun className="w-4 h-4 text-primary" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-on-surface-variant" />;
      case 'device_paired':
        return <Smartphone className="w-4 h-4 text-primary" />;
      default:
        return severity === 'high' ? (
          <AlertTriangle className="w-4 h-4 text-error" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-on-surface-variant" />
        );
    }
  };

  return (
    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-outline-variant/40 dark:before:bg-[#383a47]">
      {events.map((evt) => {
        const isSuspicious = evt.event_type === 'suspicious_unlock' && !evt.is_resolved;
        const timeStr = new Date(evt.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div key={evt.id} className="relative group">
            {/* Node Icon */}
            <div className="absolute -left-6 top-1 w-6 h-6 rounded-full bg-surface dark:bg-[#191b24] shadow-neu-raised-sm flex items-center justify-center z-10 border border-outline-variant/30">
              {getEventIcon(evt.event_type, evt.severity)}
            </div>

            <div
              className={`bg-surface dark:bg-[#191b24] p-4 rounded-2xl border transition-all duration-200 ${
                isSuspicious
                  ? 'border-error shadow-neu-raised ring-2 ring-error/40 glow-coral'
                  : 'border-outline-variant/30 shadow-neu-raised-sm hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-on-surface-variant">
                    {timeStr}
                  </span>
                  <h5 className="font-heading font-bold text-base text-on-surface dark:text-white">
                    {evt.title}
                  </h5>
                  {evt.device_name && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-surface-container dark:bg-[#14151d] text-primary dark:text-primary-fixed font-bold border border-outline-variant/30">
                      {evt.device_name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <NeoSecurityBadge status={evt.risk_score} size="sm" />
                </div>
              </div>

              <p className="text-xs font-sans text-on-surface-variant dark:text-[#c4c5d9] mb-2 leading-relaxed">
                {evt.description}
              </p>

              {/* Suspicious Action Trigger */}
              {isSuspicious && onPromptWasThisYou && (
                <div className="mt-3 pt-2.5 border-t border-error/20 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-bold text-error flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Action Required: Was this you?
                  </span>
                  <NeoButton
                    variant="danger"
                    size="sm"
                    onClick={() => onPromptWasThisYou(evt)}
                    leftIcon={<HelpCircle className="w-3.5 h-3.5" />}
                  >
                    Review Alert
                  </NeoButton>
                </div>
              )}

              {evt.is_resolved && evt.resolution_action && (
                <div className="mt-2 text-[11px] font-semibold text-secondary flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Resolved: {evt.resolution_action === 'confirmed_legitimate' ? 'Confirmed by owner' : 'Remote locked'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
