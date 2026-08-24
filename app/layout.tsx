import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LockPulse — Personal Laptop Security Control Plane',
  description: 'Your laptop. Your control. Wherever you are. Remote laptop security, suspicious-access detection, real-time alerts, and instant OS-level locking.',
  keywords: ['laptop security', 'remote lock', 'anti-theft', 'suspicious unlock alert', 'lockpulse'],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F5F5F5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-palette-canvas dark:bg-[#141313] text-foreground transition-colors duration-300 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
