'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NeoNavigation } from '@/components/neumorphic/NeoNavigation';
import { isUserAuthenticated, getStoredAuth, initialProfile, setStoredAuth } from '@/lib/store';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Client-side authentication guard check
    const authSession = getStoredAuth();
    if (!authSession) {
      // For smooth demo experience on direct URL entry, seed default session if needed
      // or redirect to login. Let's seed demo if empty, or redirect if explicitly signed out
      const hasVisited = localStorage.getItem('lockpulse_signed_out');
      if (hasVisited === 'true') {
        setIsAuthenticated(false);
        router.replace('/login');
        return;
      }
      // Seed default active session
      setStoredAuth(initialProfile);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Loading state while verifying authentication guard
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-starlight dark:bg-[#0D0E12] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white shadow-neu-button flex items-center justify-center font-heading font-extrabold text-2xl">
            ⚡
          </div>
          <span className="font-heading font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-titanium-400">
            Verifying Enclave Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-starlight dark:bg-[#0D0E12] text-foreground flex flex-col pb-20 md:pb-8 selection:bg-primary selection:text-white transition-colors duration-300">
      <NeoNavigation />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
