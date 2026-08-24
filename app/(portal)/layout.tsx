'use client';

import React from 'react';
import { NeoNavigation } from '@/components/neumorphic/NeoNavigation';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-palette-canvas dark:bg-[#141313] text-foreground flex flex-col pb-20 md:pb-8 selection:bg-palette-black selection:text-white">
      <NeoNavigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
