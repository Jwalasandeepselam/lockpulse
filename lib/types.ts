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
  hardware_fingerprint?: string;
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
  hardware_backed: boolean;
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
  metadata?: Record<string, any>;
  is_resolved: boolean;
  resolution_action?: 'confirmed_legitimate' | 'remote_locked' | 'escalated';
  resolved_at?: string;
  created_at: string;
}

export interface DeviceCommand {
  id: string;
  device_id: string;
  command_type: CommandType;
  payload: Record<string, any>;
  signature: string; // Ed25519 Detached Base64 Signature
  nonce: string; // 30-sec TTL nonce
  status: CommandStatus;
  expires_at: string;
  created_at: string;
  executed_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_alerts: boolean;
  push_alerts: boolean;
  notify_on_unlock_away: boolean;
  notify_on_failed_login: boolean;
  notify_on_remote_lock: boolean;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  device_id?: string;
  category: 'general' | 'pairing' | 'remote_lock' | 'security_alert';
  subject: string;
  description: string;
  diagnostics_payload: Record<string, any>;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
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
  recommendedAction:
    | 'none'
    | 'immediate_lock'
    | 'verify_identity'
    | 'prompt_was_this_you'
    | 'send_security_alert'
    | 'auto_lock';
}
