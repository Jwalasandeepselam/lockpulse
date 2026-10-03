-- =====================================================================
-- LockPulse Production Database Schema
-- Version: 1.0.0
-- Architecture: Zero-Trust Remote Laptop Security & Verification Plane
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (User Master)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. DEVICES TABLE (Registered Laptops)
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL CHECK (device_type IN ('laptop_windows', 'laptop_macos', 'laptop_linux')),
    os_name TEXT NOT NULL,
    os_version TEXT NOT NULL,
    agent_version TEXT NOT NULL,
    hardware_fingerprint TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'locked', 'compromised')),
    presence_status TEXT NOT NULL DEFAULT 'unknown' CHECK (presence_status IN ('nearby', 'away', 'unknown')),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. DEVICE KEYS METADATA TABLE (Public Keys only - Private keys never leave device)
CREATE TABLE IF NOT EXISTS public.device_keys_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    public_key TEXT NOT NULL,
    key_algorithm TEXT NOT NULL DEFAULT 'Ed25519',
    hardware_backed BOOLEAN NOT NULL DEFAULT FALSE, -- TPM / Secure Enclave flag
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DEVICE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL,
    ip_address INET,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SECURITY EVENTS TABLE (Audit Log & Suspicious Access)
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_score TEXT NOT NULL DEFAULT 'LOW' CHECK (risk_score IN ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN')),
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolution_action TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DEVICE COMMANDS TABLE (Cryptographically Signed Commands)
CREATE TABLE IF NOT EXISTS public.device_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    command_type TEXT NOT NULL CHECK (command_type IN ('lock', 'ping', 'query_state', 'wipe_session')),
    payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    signature TEXT NOT NULL,
    nonce TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'executed', 'failed', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    executed_at TIMESTAMPTZ
);

-- 7. COMMAND RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.command_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID NOT NULL REFERENCES public.device_commands(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    success BOOLEAN NOT NULL,
    result_data JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. NOTIFICATION PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    push_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_unlock_away BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_failed_login BOOLEAN NOT NULL DEFAULT TRUE,
    notify_on_remote_lock BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SUPPORT TICKETS TABLE (Sanitized non-sensitive diagnostics)
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    diagnostics_payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TRUSTED DEVICES & RECOVERY METHODS TABLES
CREATE TABLE IF NOT EXISTS public.trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_label TEXT NOT NULL,
    is_companion_phone BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recovery_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    method_type TEXT NOT NULL CHECK (method_type IN ('recovery_code', 'passkey', 'backup_email')),
    key_hash TEXT NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- PERFORMANCE INDEXES
-- =====================================================================
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON public.devices(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_hardware_fingerprint ON public.devices(hardware_fingerprint);
CREATE INDEX IF NOT EXISTS idx_device_keys_device_id ON public.device_keys_metadata(device_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_device_id ON public.device_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_security_events_user_created ON public.security_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_device_id ON public.security_events(device_id);
CREATE INDEX IF NOT EXISTS idx_device_commands_device_status ON public.device_commands(device_id, status);
CREATE INDEX IF NOT EXISTS idx_command_results_command_id ON public.command_results(command_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON public.trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_recovery_methods_user_id ON public.recovery_methods(user_id);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_keys_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.command_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_methods ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Devices Policies
CREATE POLICY "Users can view own devices" ON public.devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register own devices" ON public.devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own devices" ON public.devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own devices" ON public.devices FOR DELETE USING (auth.uid() = user_id);

-- 3. Device Keys Metadata Policies (Ed25519 Public Keys)
CREATE POLICY "Users can view own device keys" ON public.device_keys_metadata FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);
CREATE POLICY "Users can register own device keys" ON public.device_keys_metadata FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);
CREATE POLICY "Users can delete own device keys" ON public.device_keys_metadata FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);

-- 4. Device Sessions Policies
CREATE POLICY "Users can view own device sessions" ON public.device_sessions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);
CREATE POLICY "Users can manage own device sessions" ON public.device_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);

-- 5. Security Events Policies
CREATE POLICY "Users can view own security events" ON public.security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own security events" ON public.security_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own security events" ON public.security_events FOR UPDATE USING (auth.uid() = user_id);

-- 6. Device Commands Policies
CREATE POLICY "Users can view commands for own devices" ON public.device_commands FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);
CREATE POLICY "Users can create commands for own devices" ON public.device_commands FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);
CREATE POLICY "Users can update commands for own devices" ON public.device_commands FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);

-- 7. Command Results Policies
CREATE POLICY "Users can view command results for own devices" ON public.command_results FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);
CREATE POLICY "Users can manage command results for own devices" ON public.command_results FOR ALL USING (
    EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid())
);

-- 8. Notification Preferences Policies
CREATE POLICY "Users can view own preferences" ON public.notification_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- 9. Support Tickets Policies
CREATE POLICY "Users can view own support tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own support tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. Trusted Devices & Recovery Methods Policies
CREATE POLICY "Users can manage own trusted devices" ON public.trusted_devices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recovery methods" ON public.recovery_methods FOR ALL USING (auth.uid() = user_id);
