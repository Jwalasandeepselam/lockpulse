'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('sandeep@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-palette-canvas dark:bg-[#141313] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-palette-black dark:bg-palette-white text-white dark:text-palette-black shadow-editorial-sm flex items-center justify-center font-heading font-extrabold text-2xl">
              ⚡
            </div>
          </Link>
          <h1 className="font-heading font-extrabold text-3xl text-palette-black dark:text-white tracking-wide">
            SIGN IN TO LOCKPULSE
          </h1>
          <p className="text-xs font-sans text-palette-ash mt-1">
            Access your personal laptop security control plane
          </p>
        </div>

        {/* Login Form Card */}
        <NeoCard variant="raised" className="p-8 space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <NeoInput
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-palette-ash" />}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading tracking-wider uppercase text-xs text-palette-charcoal dark:text-palette-sand">
                  Password
                </span>
                <Link
                  href="/forgot-password"
                  className="text-xs font-sans text-palette-ash hover:text-palette-black dark:hover:text-white font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <NeoInput
                type="password"
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-palette-ash" />}
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 text-security-danger rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <NeoButton
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In
              </NeoButton>
            </div>
          </form>

          {/* Social Auth Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-palette-sand dark:border-[#3E3B3A]"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono font-bold uppercase tracking-widest text-palette-ash">
              Or continue with
            </span>
            <div className="flex-grow border-t border-palette-sand dark:border-[#3E3B3A]"></div>
          </div>

          <NeoButton
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleLogin}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Google Single Sign-On
          </NeoButton>
        </NeoCard>

        {/* Footer Link */}
        <p className="text-center text-xs font-sans text-palette-ash">
          Don't have an account?{' '}
          <Link href="/signup" className="text-palette-black dark:text-white font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
