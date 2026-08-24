-- =========================================================================
-- LOCKPULSE PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Master Migration: 20260824000000_init_lockpulse.sql
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 2. TABLES DEFINITION
-- =========================================================================

-- 2.1 PROFILES (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone_number TEXT,
    is_onboarded BOOLEAN NOT NULL DEFAULT false,
    security_tier TEXT NOT NULL DEFAULT 'standard', -- 'standard', 'enhanced'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.2 DEVICES (User laptops registered in LockPulse)
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL DEFAULT 'laptop_windows', -- 'laptop_windows', 'laptop_macos'
    os_name TEXT NOT NULL,                              -- 'Windows 11 Pro', 'macOS Sonoma'
    os_version TEXT NOT NULL DEFAULT '1.0',
    agent_version TEXT NOT NULL DEFAULT '1.0.0',
    status TEXT NOT NULL DEFAULT 'offline',             -- 'online', 'offline', 'locked', 'warning'
    presence_status TEXT NOT NULL DEFAULT 'unknown',     -- 'nearby', 'away', 'unknown'
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    is_registered BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.3 DEVICE KEYS METADATA (Public Keys Only - NEVER Private Keys)
CREATE TABLE IF NOT EXISTS public.device_keys_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE UNIQUE,
    public_key TEXT NOT NULL,                           -- Ed25519 Public Key (Base64)
    key_algorithm TEXT NOT NULL DEFAULT 'Ed25519',
    hardware_fingerprint TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.4 DEVICE SESSIONS
CREATE TABLE IF NOT EXISTS public.device_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.5 SECURITY EVENTS & ACTIVITY TIMELINE
CREATE TABLE IF NOT EXISTS public.security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'unlock', 'lock', 'wake', 'sleep', 'login_fail', 'suspicious_unlock', 'remote_lock_req', 'remote_lock_ack'
    severity TEXT NOT NULL DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_score TEXT NOT NULL DEFAULT 'LOW', -- 'LOW', 'MEDIUM', 'HIGH', 'UNKNOWN'
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_resolved BOOLEAN NOT NULL DEFAULT false,
    resolution_action TEXT, -- 'confirmed_legitimate', 'remote_locked', 'marked_stolen'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.6 DEVICE COMMANDS (Signed, Time-bound, Nonce-tracked)
CREATE TABLE IF NOT EXISTS public.device_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    command_type TEXT NOT NULL, -- 'LOCK', 'PING', 'STATUS_CHECK'
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    nonce TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'EXECUTED', 'FAILED', 'EXPIRED'
    expires_at TIMESTAMPTZ NOT NULL,
    executed_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.7 COMMAND RESULTS (Audit confirmation from laptop agent)
CREATE TABLE IF NOT EXISTS public.command_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    command_id UUID NOT NULL REFERENCES public.device_commands(id) ON DELETE CASCADE,
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    status TEXT NOT NULL, -- 'SUCCESS', 'FAILED'
    output_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.8 NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_alerts BOOLEAN NOT NULL DEFAULT true,
    push_alerts BOOLEAN NOT NULL DEFAULT true,
    notify_on_unlock_away BOOLEAN NOT NULL DEFAULT true,
    notify_on_new_device BOOLEAN NOT NULL DEFAULT true,
    notify_on_failed_login BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.9 TRUSTED DEVICES & RECOVERY METHODS
CREATE TABLE IF NOT EXISTS public.trusted_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL, -- 'phone_ios', 'phone_android', 'browser'
    is_current BOOLEAN NOT NULL DEFAULT false,
    last_authenticated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recovery_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    method_type TEXT NOT NULL, -- 'recovery_code', 'backup_email', 'fido2_passkey'
    is_configured BOOLEAN NOT NULL DEFAULT true,
    last_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.10 SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general', -- 'pairing', 'remote_lock', 'security_alert', 'general'
    status TEXT NOT NULL DEFAULT 'open',     -- 'open', 'in_progress', 'resolved'
    diagnostics_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.11 AI CONVERSATIONS (Sandboxed AI Security Assistant)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    intent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2.12 AUDIT LOGS (Immutable security audit stream)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'LOGIN', 'DEVICE_ADDED', 'DEVICE_REMOVED', 'DEVICE_LOCKED', 'SECURITY_EVENT_RESOLVED'
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_keys_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.command_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Devices Policies
CREATE POLICY "Users can view own devices" ON public.devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own devices" ON public.devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own devices" ON public.devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own devices" ON public.devices FOR DELETE USING (auth.uid() = user_id);

-- Device Keys Metadata Policies
CREATE POLICY "Users can view own device keys" ON public.device_keys_metadata FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.devices d WHERE d.id = device_id AND d.user_id = auth.uid()));

-- Security Events Policies
CREATE POLICY "Users can view own security events" ON public.security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own security events" ON public.security_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own security events" ON public.security_events FOR UPDATE USING (auth.uid() = user_id);

-- Device Commands Policies
CREATE POLICY "Users can view own device commands" ON public.device_commands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own device commands" ON public.device_commands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own device commands" ON public.device_commands FOR UPDATE USING (auth.uid() = user_id);

-- Notification Preferences
CREATE POLICY "Users can manage own notification prefs" ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Support Tickets
CREATE POLICY "Users can manage own support tickets" ON public.support_tickets FOR ALL USING (auth.uid() = user_id);

-- AI Conversations
CREATE POLICY "Users can manage own AI chats" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

-- Audit Logs
CREATE POLICY "Users can view own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);

-- =========================================================================
-- 4. TRIGGERS & AUTOMATION
-- =========================================================================

-- Trigger to automatically create profile and default notification preferences on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );

    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
CREATE TRIGGER update_devices_timestamp BEFORE UPDATE ON public.devices FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();
