'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Laptop, Plus, Search } from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-palette-black dark:text-white tracking-wide">
            CONNECTED DEVICES
          </h1>
          <p className="text-xs sm:text-sm font-sans text-palette-ash mt-1">
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
      <NeoCard variant="flat" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <NeoInput
            placeholder="Search devices or OS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-palette-ash" />}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wide transition-all ${
              filterType === 'all'
                ? 'bg-palette-black text-white shadow-editorial-sm'
                : 'text-palette-ash hover:bg-palette-sand-light'
            }`}
          >
            All ({devices.length})
          </button>
          <button
            onClick={() => setFilterType('online')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wide transition-all ${
              filterType === 'online'
                ? 'bg-emerald-600 text-white shadow-editorial-sm'
                : 'text-palette-ash hover:bg-palette-sand-light'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilterType('locked')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading uppercase tracking-wide transition-all ${
              filterType === 'locked'
                ? 'bg-security-danger text-white shadow-editorial-sm'
                : 'text-palette-ash hover:bg-palette-sand-light'
            }`}
          >
            Locked
          </button>
        </div>
      </NeoCard>

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
          <Laptop className="w-12 h-12 text-palette-ash mx-auto mb-3" />
          <h3 className="font-heading text-lg text-palette-charcoal dark:text-palette-sand tracking-wide">
            NO DEVICES MATCHED YOUR FILTER
          </h3>
          <p className="text-xs font-sans text-palette-ash mt-1">Try resetting your search or pairing a new laptop.</p>
        </div>
      )}
    </div>
  );
}
