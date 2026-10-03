'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Laptop, Plus, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { NeoDeviceCard } from '@/components/neumorphic/NeoDeviceCard';
import { getStoredDevices, updateStoredDevice, addStoredEvent } from '@/lib/store';
import { Device, SecurityEvent } from '@/lib/types';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'locked'>('all');
  const [lockingDeviceId, setLockingDeviceId] = useState<string | null>(null);

  useEffect(() => {
    setDevices(getStoredDevices());
  }, []);

  const filteredDevices = devices.filter((d) => {
    const matchesSearch =
      d.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.os_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'online') return d.status === 'online';
    if (filterType === 'locked') return d.status === 'locked';
    return true;
  });

  const handleLockDevice = async (deviceId: string) => {
    setLockingDeviceId(deviceId);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const updated = updateStoredDevice(deviceId, {
      status: 'locked',
      last_activity: new Date().toISOString(),
    });
    setDevices(updated);

    const targetDev = devices.find((d) => d.id === deviceId);
    const newEvent: SecurityEvent = {
      id: `evt_lock_${Date.now()}`,
      user_id: targetDev?.user_id || 'usr_01',
      device_id: deviceId,
      device_name: targetDev?.device_name || 'Laptop',
      event_type: 'remote_lock_ack',
      severity: 'low',
      title: 'Remote Lock Executed',
      description: `Dispatched signed OS lock command. ${targetDev?.device_name || 'Device'} entered native lock screen.`,
      risk_score: 'LOW',
      metadata: { source: 'devices_page' },
      is_resolved: true,
      created_at: new Date().toISOString(),
    };
    addStoredEvent(newEvent);

    setLockingDeviceId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface dark:text-white tracking-tight">
            Connected Devices
          </h1>
          <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400 mt-0.5">
            Manage your registered laptops, cryptographic identity keys, and remote locking controls.
          </p>
        </div>

        <Link href="/devices/connect">
          <NeoButton variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Pair New Laptop
          </NeoButton>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface dark:bg-[#16181F] p-4 rounded-2xl shadow-neu-raised-sm border border-outline-variant/60 dark:border-[#282B38] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <NeoInput
            placeholder="Search devices or OS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-on-surface-variant" />}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-primary text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-[#242735]'
            }`}
          >
            All ({devices.length})
          </button>
          <button
            onClick={() => setFilterType('online')}
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all cursor-pointer ${
              filterType === 'online'
                ? 'bg-secondary text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-[#242735]'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilterType('locked')}
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all cursor-pointer ${
              filterType === 'locked'
                ? 'bg-error text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container dark:hover:bg-[#242735]'
            }`}
          >
            Locked
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
      {devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <NeoDeviceCard
              key={device.id}
              device={device}
              onLockDevice={handleLockDevice}
              isLocking={lockingDeviceId === device.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface dark:bg-[#16181F] rounded-3xl p-10 shadow-neu-raised border border-outline-variant/80 dark:border-[#282B38] text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20 shadow-neu-raised-sm">
            <Laptop className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-on-surface dark:text-white tracking-tight">
            No Devices Enrolled
          </h3>
          <p className="text-xs sm:text-sm font-sans text-on-surface-variant dark:text-titanium-400">
            Pair your MacBook or Windows computer with LockPulse to start monitoring telemetry and dispatching lock commands.
          </p>
          <div className="pt-2">
            <Link href="/devices/connect">
              <NeoButton variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Enroll Your Laptop Now
              </NeoButton>
            </Link>
          </div>
        </div>
      )}

      {devices.length > 0 && filteredDevices.length === 0 && (
        <div className="text-center py-16">
          <Laptop className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-60" />
          <h3 className="font-heading text-lg font-bold text-on-surface dark:text-white">
            No devices matched "{searchQuery}"
          </h3>
          <p className="text-xs font-sans text-on-surface-variant dark:text-titanium-400 mt-1">
            Try resetting your search query or switching filters.
          </p>
        </div>
      )}
    </div>
  );
}
