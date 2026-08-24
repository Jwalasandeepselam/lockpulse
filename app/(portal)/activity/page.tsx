'use client';

import React, { useState } from 'react';
import {
  Activity,
  Filter,
  Download,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
import { WasThisYouModal } from '@/components/security/WasThisYouModal';
import { initialEvents, initialDevices } from '@/lib/store';
import { SecurityEvent } from '@/lib/types';

export default function ActivityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>(initialEvents);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'resolved'>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<SecurityEvent | null>(null);

  const filteredEvents = events.filter((e) => {
    if (filterSeverity === 'high') return e.severity === 'high' || e.risk_score === 'HIGH';
    if (filterSeverity === 'resolved') return e.is_resolved;
    return true;
  });

  const handleConfirmLegitimate = async (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, is_resolved: true, resolution_action: 'confirmed_legitimate' }
          : e
      )
    );
  };

  const handleLockdownDevice = async (deviceId: string, eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, is_resolved: true, resolution_action: 'remote_locked' }
          : e
      )
    );
  };

  const handleExportAudit = () => {
    const jsonStr = JSON.stringify(events, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lockpulse-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            Security Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Immutable audit record of laptop locks, unlock events, proximity changes, and remote commands.
          </p>
        </div>

        <NeoButton
          variant="secondary"
          size="sm"
          onClick={handleExportAudit}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export Audit Trail
        </NeoButton>
      </div>

      {/* Filter Bar */}
      <NeoCard variant="flat" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-pulse-blue" />
          <span className="text-xs font-heading font-bold text-slate-700 dark:text-slate-300">
            Showing {filteredEvents.length} Events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              filterSeverity === 'all'
                ? 'bg-pulse-blue text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterSeverity('high')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              filterSeverity === 'high'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            High Risk / Suspicious
          </button>
          <button
            onClick={() => setFilterSeverity('resolved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition-all ${
              filterSeverity === 'resolved'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Resolved
          </button>
        </div>
      </NeoCard>

      {/* Activity Timeline Feed */}
      <NeoCard variant="raised" className="p-6">
        <NeoTimeline
          events={filteredEvents}
          onPromptWasThisYou={(evt) => setActiveModalEvent(evt)}
        />
      </NeoCard>

      {/* Was This You Modal */}
      <WasThisYouModal
        isOpen={Boolean(activeModalEvent)}
        onClose={() => setActiveModalEvent(null)}
        event={activeModalEvent}
        onConfirmLegitimate={handleConfirmLegitimate}
        onLockdownDevice={handleLockdownDevice}
      />
    </div>
  );
}
