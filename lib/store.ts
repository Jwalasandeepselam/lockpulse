import { Device, SecurityEvent, UserProfile, DeviceCommand, SupportTicket, AIConversationMessage, PresenceStatus } from './types';

// Storage Keys
export const STORAGE_KEYS = {
  DEVICES: 'lockpulse_enrolled_devices_v2',
  EVENTS: 'lockpulse_security_events_v2',
  PROFILE: 'lockpulse_user_profile_v2',
  AUTH: 'lockpulse_auth_session_v2',
};

// Initial Mock User Profile
export const initialProfile: UserProfile = {
  id: 'usr_sandeep_01',
  email: 'sandeep@example.com',
  full_name: 'Sandeep',
  avatar_url: null,
  phone_number: '+1 (555) 234-5678',
  is_onboarded: true,
  security_tier: 'enhanced',
  created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

// Initial Enrolled Devices: 0 In-built laptops by default (Empty state)
export const initialDevices: Device[] = [];

// Initial Security Events Stream
export const initialEvents: SecurityEvent[] = [];

// Initial AI Assistant Messages
export const initialAIMessages: AIConversationMessage[] = [
  {
    id: 'ai_01',
    user_id: 'usr_sandeep_01',
    role: 'assistant',
    content: `Hello! I am your LockPulse AI Security Assistant. I monitor your device telemetry, explain security alerts, and help troubleshoot pairing or lock policies. How can I assist your security today?`,
    intent: 'greeting',
    created_at: new Date().toISOString(),
  },
];

// Helper: Check if running in browser
const isClient = typeof window !== 'undefined';

// --- Devices LocalStorage Persistence ---

export function getStoredDevices(): Device[] {
  if (!isClient) return initialDevices;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DEVICES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load devices from localStorage:', err);
    return [];
  }
}

export function saveStoredDevices(devices: Device[]): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
  } catch (err) {
    console.error('Failed to save devices to localStorage:', err);
  }
}

export function addStoredDevice(deviceData: Partial<Device> & { device_name: string; os_name: string }): Device {
  const current = getStoredDevices();
  const isMac = deviceData.os_name.toLowerCase().includes('mac') || deviceData.device_type === 'laptop_macos';
  
  const newDevice: Device = {
    id: deviceData.id || `dev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    user_id: deviceData.user_id || initialProfile.id,
    device_name: deviceData.device_name,
    device_type: isMac ? 'laptop_macos' : 'laptop_windows',
    os_name: deviceData.os_name,
    os_version: deviceData.os_version || (isMac ? 'macOS 15.0 Sequoia' : 'Windows 11 23H2'),
    agent_version: '1.2.0',
    status: 'online',
    presence_status: 'nearby',
    public_key: deviceData.public_key || `ed25519_pk_${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
    hardware_fingerprint: deviceData.hardware_fingerprint || `HW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    last_seen: new Date().toISOString(),
    last_activity: new Date().toISOString(),
    is_registered: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updated = [newDevice, ...current.filter((d) => d.id !== newDevice.id)];
  saveStoredDevices(updated);

  // Also log a device_paired event
  addStoredEvent({
    id: `evt_pair_${Date.now()}`,
    user_id: newDevice.user_id,
    device_id: newDevice.id,
    device_name: newDevice.device_name,
    event_type: 'device_paired',
    severity: 'low',
    title: 'Device Enrolled & Paired',
    description: `Cryptographic pairing established for ${newDevice.device_name} (${newDevice.os_name}) via Ed25519 keys.`,
    risk_score: 'LOW',
    metadata: { agent: newDevice.agent_version },
    is_resolved: true,
    created_at: new Date().toISOString(),
  });

  return newDevice;
}

export function updateStoredDevice(deviceId: string, updates: Partial<Device>): Device[] {
  const current = getStoredDevices();
  const updated = current.map((d) => (d.id === deviceId ? { ...d, ...updates, updated_at: new Date().toISOString() } : d));
  saveStoredDevices(updated);
  return updated;
}

export function removeStoredDevice(deviceId: string): Device[] {
  const current = getStoredDevices();
  const updated = current.filter((d) => d.id !== deviceId);
  saveStoredDevices(updated);
  return updated;
}

// --- Events LocalStorage Persistence ---

export function getStoredEvents(): SecurityEvent[] {
  if (!isClient) return initialEvents;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load events from localStorage:', err);
    return [];
  }
}

export function saveStoredEvents(events: SecurityEvent[]): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to localStorage:', err);
  }
}

export function addStoredEvent(event: SecurityEvent): void {
  const current = getStoredEvents();
  const updated = [event, ...current];
  saveStoredEvents(updated);
}

// --- User Profile Persistence ---

export function getStoredProfile(): UserProfile {
  if (!isClient) return initialProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return initialProfile;
    return JSON.parse(raw);
  } catch {
    return initialProfile;
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

// --- Auth Session Persistence ---

export interface AuthSession {
  user: UserProfile;
  token: string;
  authenticatedAt: string;
}

export function getStoredAuth(): AuthSession | null {
  if (!isClient) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredAuth(user: UserProfile, token: string = 'lp_token_sess_' + Date.now()): void {
  if (!isClient) return;
  try {
    const session: AuthSession = {
      user,
      token,
      authenticatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    saveStoredProfile(user);
  } catch (err) {
    console.error('Failed to save auth session:', err);
  }
}

export function clearStoredAuth(): void {
  if (!isClient) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch (err) {
    console.error('Failed to clear auth session:', err);
  }
}

export function isUserAuthenticated(): boolean {
  if (!isClient) return true; // Default to true during SSR to avoid hydration flicker
  const session = getStoredAuth();
  return Boolean(session && session.token);
}
