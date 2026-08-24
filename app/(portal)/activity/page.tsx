'use client';

import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
import { WasThisYouModal } from '@/components/security/WasThisYouModal';
import { initialEvents } from '@/lib/store';
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
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-palette-black dark:text-white tracking-wide">
            SECURITY TIMELINE
          </h1>
          <p className="text-xs sm:text-sm font-sans text-palette-ash mt-1">
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
          <Calendar className="w-4 h-4 text-palette-black dark:text-white" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-palette-charcoal dark:text-palette-sand">
            Showing {filteredEvents.length} Events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wide transition-all ${
              filterSeverity === 'all'
                ? 'bg-palette-black text-white shadow-editorial-sm'
                : 'text-palette-ash hover:bg-palette-sand-light'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterSeverity('high')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wide transition-all ${
              filterSeverity === 'high'
                ? 'bg-security-danger text-white shadow-editorial-sm'
                : 'text-palette-ash hover:bg-palette-sand-light'
            }`}
          >
            High Risk / Suspicious
          </button>
          <button
            onClick={() => setFilterSeverity('resolved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wide transition-all ${
              filterSeverity === 'resolved'
                ? 'bg-emerald-600 text-white shadow-editorial-sm'
                : 'text-palette-ash hover:bg-palette-sand-light'
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
