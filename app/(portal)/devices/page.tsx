'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Laptop, Plus, Search } from 'lucide-react';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { NeoDeviceCard } from '@/components/neumorphic/NeoDeviceCard';
import { initialDevices } from '@/lib/store';
import { Device } from '@/lib/types';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'online' | 'locked'>('all');
  const [lockingDeviceId, setLockingDeviceId] = useState<string | null>(null);

  const filteredDevices = devices.filter((d) => {
    const matchesSearch = d.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.os_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'online') return d.status === 'online';
    if (filterType === 'locked') return d.status === 'locked';
    return true;
  });

  const handleLockDevice = async (deviceId: string) => {
    setLockingDeviceId(deviceId);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, status: 'locked' } : d))
    );
    setLockingDeviceId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-on-surface dark:text-white tracking-tight">
            Connected Devices
          </h1>
          <p className="text-xs sm:text-sm font-sans text-on-surface-variant mt-0.5">
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
      <div className="bg-surface dark:bg-[#191b24] p-4 rounded-2xl shadow-neu-raised-sm border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all ${
              filterType === 'all'
                ? 'bg-primary text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            All ({devices.length})
          </button>
          <button
            onClick={() => setFilterType('online')}
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all ${
              filterType === 'online'
                ? 'bg-secondary text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilterType('locked')}
            className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold uppercase transition-all ${
              filterType === 'locked'
                ? 'bg-error text-white shadow-neu-button'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Locked
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
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

      {filteredDevices.length === 0 && (
        <div className="text-center py-16">
          <Laptop className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
          <h3 className="font-heading text-lg text-on-surface dark:text-white">
            No devices matched your filter
          </h3>
          <p className="text-xs font-sans text-on-surface-variant mt-1">
            Try resetting your search or pairing a new laptop.
          </p>
        </div>
      )}
    </div>
  );
}
