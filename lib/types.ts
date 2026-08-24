// =========================================================================
// LOCKPULSE DOMAIN TYPES & INTERFACES
// =========================================================================

export type DeviceType = 'laptop_windows' | 'laptop_macos';
export type DeviceStatus = 'online' | 'offline' | 'locked' | 'warning';
export type PresenceStatus = 'nearby' | 'away' | 'unknown';
export type RiskScore = 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export type EventType =
  | 'unlock'
  | 'lock'
  | 'wake'
  | 'sleep'
  | 'login_fail'
  | 'suspicious_unlock'
  | 'remote_lock_req'
  | 'remote_lock_ack'
  | 'device_paired'
  | 'device_disconnected'
  | 'config_change';

export type CommandType = 'LOCK' | 'PING' | 'STATUS_CHECK';
export type CommandStatus = 'PENDING' | 'SENT' | 'EXECUTED' | 'FAILED' | 'EXPIRED';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  is_onboarded: boolean;
  security_tier: 'standard' | 'enhanced';
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  user_id: string;
  device_name: string;
  device_type: DeviceType;
  os_name: string;
  os_version: string;
  agent_version: string;
  status: DeviceStatus;
  presence_status: PresenceStatus;
  last_seen: string;
  last_activity: string;
  is_registered: boolean;
  created_at: string;
  updated_at: string;
}

export interface DeviceKeyMetadata {
  id: string;
  device_id: string;
  public_key: string; // Ed25519 Base64
  key_algorithm: string;
  hardware_fingerprint: string;
  created_at: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  device_id?: string;
  device_name?: string;
  event_type: EventType;
  severity: SecuritySeverity;
  title: string;
  description: string;
  risk_score: RiskScore;
  metadata: Record<string, any>;
  is_resolved: boolean;
  resolution_action?: 'confirmed_legitimate' | 'remote_locked' | 'marked_stolen';
  created_at: string;
}

export interface DeviceCommand {
  id: string;
  user_id: string;
  device_id: string;
  command_type: CommandType;
  payload: Record<string, any>;
  nonce: string;
  status: CommandStatus;
  expires_at: string;
  executed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_alerts: boolean;
  push_alerts: boolean;
  notify_on_unlock_away: boolean;
  notify_on_new_device: boolean;
  notify_on_failed_login: boolean;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  device_id?: string;
  subject: string;
  description: string;
  category: 'pairing' | 'remote_lock' | 'security_alert' | 'general';
  status: 'open' | 'in_progress' | 'resolved';
  diagnostics_payload?: Record<string, any>;
  created_at: string;
}

export interface AIConversationMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: string;
  created_at: string;
}

export interface RiskEvaluationResult {
  score: RiskScore;
  reasons: string[];
  recommendedAction?: 'none' | 'prompt_was_this_you' | 'immediate_lock' | 'verify_identity';
}

export interface PairingChallenge {
  challenge_code: string;
  device_name: string;
  device_type: DeviceType;
  os_name: string;
  public_key: string;
  hardware_fingerprint: string;
  expires_at: string;
}
