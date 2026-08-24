import { Device, SecurityEvent, UserProfile, DeviceCommand, SupportTicket, AIConversationMessage, PresenceStatus } from './types';
import { evaluateRisk } from './risk-engine';
import { generateCommandNonce, isNonceValid } from './crypto';

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

// Initial Mock Devices
export const initialDevices: Device[] = [
  {
    id: 'dev_macbook_pro_16',
    user_id: 'usr_sandeep_01',
    device_name: 'MacBook Pro 16"',
    device_type: 'laptop_macos',
    os_name: 'macOS Sonoma 14.6',
    os_version: '14.6.1',
    agent_version: '1.2.0',
    status: 'online',
    presence_status: 'away',
    last_seen: new Date().toISOString(),
    last_activity: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // 4 mins ago
    is_registered: true,
    created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'dev_thinkpad_x1',
    user_id: 'usr_sandeep_01',
    device_name: 'ThinkPad X1 Carbon',
    device_type: 'laptop_windows',
    os_name: 'Windows 11 Pro',
    os_version: '23H2 (22631)',
    agent_version: '1.2.0',
    status: 'online',
    presence_status: 'nearby',
    last_seen: new Date().toISOString(),
    last_activity: new Date(Date.now() - 35 * 60 * 1000).toISOString(), // 35 mins ago
    is_registered: true,
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial Security Events Stream
export const initialEvents: SecurityEvent[] = [
  {
    id: 'evt_001',
    user_id: 'usr_sandeep_01',
    device_id: 'dev_macbook_pro_16',
    device_name: 'MacBook Pro 16"',
    event_type: 'suspicious_unlock',
    severity: 'high',
    title: 'Suspicious Unlock Detected',
    description: 'Device was unlocked while registered phone appeared to be away.',
    risk_score: 'HIGH',
    metadata: { location_guess: 'Home Office', proximity_rssi: -92 },
    is_resolved: false,
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt_002',
    user_id: 'usr_sandeep_01',
    device_id: 'dev_macbook_pro_16',
    device_name: 'MacBook Pro 16"',
    event_type: 'unlock',
    severity: 'medium',
    title: 'Laptop Unlocked',
    description: 'Operating system login screen unlocked.',
    risk_score: 'MEDIUM',
    metadata: { auth_method: 'Touch ID' },
    is_resolved: true,
    resolution_action: 'confirmed_legitimate',
    created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt_003',
    user_id: 'usr_sandeep_01',
    device_id: 'dev_thinkpad_x1',
    device_name: 'ThinkPad X1 Carbon',
    event_type: 'lock',
    severity: 'low',
    title: 'Laptop Locked',
    description: 'System entered Windows LockWorkStation state.',
    risk_score: 'LOW',
    metadata: { reason: 'user_idle_timeout' },
    is_resolved: true,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'evt_004',
    user_id: 'usr_sandeep_01',
    device_id: 'dev_thinkpad_x1',
    device_name: 'ThinkPad X1 Carbon',
    event_type: 'device_paired',
    severity: 'low',
    title: 'Device Paired Successfully',
    description: 'Ed25519 cryptographic pairing established with LockPulse Cloud.',
    risk_score: 'LOW',
    metadata: { agent: 'v1.2.0' },
    is_resolved: true,
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
  },
];

// Initial AI Assistant Messages
export const initialAIMessages: AIConversationMessage[] = [
  {
    id: 'ai_01',
    user_id: 'usr_sandeep_01',
    role: 'assistant',
    content: `Hello Sandeep, I am your LockPulse AI Security Assistant. I monitor your device telemetry, explain security alerts, and help troubleshoot pairing or lock policies. How can I assist your security today?`,
    intent: 'greeting',
    created_at: new Date().toISOString(),
  },
];
