'use client';

import React, { useState, useEffect } from 'react';
import { Download, Calendar, ShieldAlert } from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoTimeline } from '@/components/neumorphic/NeoTimeline';
import { WasThisYouModal } from '@/components/security/WasThisYouModal';
import { getStoredEvents, addStoredEvent } from '@/lib/store';
import { SecurityEvent } from '@/lib/types';

export default function ActivityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'resolved'>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<SecurityEvent | null>(null);

  useEffect(() => {
    setEvents(getStoredEvents());
  }, []);

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
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl text-on-surface dark:text-white tracking-tight">
            Security Timeline
          </h1>
          <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
            Immutable cryptographic audit trail of laptop locks, unlock events, and remote commands.
          </p>
        </div>

        <NeoButton
          variant="secondary"
          size="sm"
          onClick={handleExportAudit}
          leftIcon={<Download className="w-4 h-4" />}
          disabled={events.length === 0}
        >
          Export Audit Trail
        </NeoButton>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface dark:bg-[#16181F] p-4 rounded-2xl shadow-neu-raised-sm border border-outline-variant/60 dark:border-[#282B38] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface dark:text-white">
            Showing {filteredEvents.length} Events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wide transition-all cursor-pointer ${
              filterSeverity === 'all'
                ? 'bg-primary text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-[#242735]'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterSeverity('high')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wide transition-all cursor-pointer ${
              filterSeverity === 'high'
                ? 'bg-error text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-[#242735]'
            }`}
          >
            High Risk
          </button>
          <button
            onClick={() => setFilterSeverity('resolved')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wide transition-all cursor-pointer ${
              filterSeverity === 'resolved'
                ? 'bg-secondary text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-[#242735]'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

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
