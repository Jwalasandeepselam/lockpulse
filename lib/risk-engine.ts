import { EventType, PresenceStatus, RiskEvaluationResult, RiskScore } from './types';

export interface RiskInputContext {
  eventType: EventType;
  presenceStatus: PresenceStatus;
  hourOfDay?: number; // 0 - 23
  failedAttemptsCount?: number;
  isKnownNetwork?: boolean;
  batteryStatus?: 'charging' | 'discharging';
  deviceStatus?: string;
}

/**
 * Transparent, deterministic risk evaluation engine for LockPulse.
 * Computes risk scores (LOW, MEDIUM, HIGH, UNKNOWN) with explainable reasons.
 */
export function evaluateRisk(context: RiskInputContext): RiskEvaluationResult {
  const reasons: string[] = [];
  const hour = context.hourOfDay ?? new Date().getHours();
  const isUnusualHour = hour < 6 || hour >= 23; // 11 PM to 6 AM

  // Rule 1: Routine operations when owner is nearby
  if (context.presenceStatus === 'nearby') {
    if (context.eventType === 'unlock' || context.eventType === 'wake' || context.eventType === 'lock') {
      return {
        score: 'LOW',
        reasons: ['Owner phone verified nearby via local proximity signal', 'Normal device lifecycle transition'],
        recommendedAction: 'none',
      };
    }
  }

  // Rule 2: Multiple failed login attempts
  if (context.eventType === 'login_fail' || (context.failedAttemptsCount && context.failedAttemptsCount > 0)) {
    reasons.push(`Failed login attempt detected (${context.failedAttemptsCount ?? 1} occurrence)`);
    if (context.presenceStatus === 'away') {
      reasons.push('Owner phone is currently away');
      return {
        score: 'HIGH',
        reasons,
        recommendedAction: 'immediate_lock',
      };
    }
    return {
      score: 'MEDIUM',
      reasons,
      recommendedAction: 'verify_identity',
    };
  }

  // Rule 3: Laptop unlocked while phone is away ("Was This You?" trigger)
  if (context.eventType === 'unlock' && context.presenceStatus === 'away') {
    reasons.push('Laptop was unlocked while registered phone appears to be away');
    if (isUnusualHour) {
      reasons.push(`Activity occurred at unusual hour (${hour}:00)`);
      return {
        score: 'HIGH',
        reasons,
        recommendedAction: 'prompt_was_this_you',
      };
    }
    return {
      score: 'MEDIUM',
      reasons,
      recommendedAction: 'prompt_was_this_you',
    };
  }

  // Rule 4: Suspicious unlock explicit flag
  if (context.eventType === 'suspicious_unlock') {
    reasons.push('Anomalous unlock event detected by laptop agent telemetry');
    if (context.presenceStatus === 'away') {
      reasons.push('Owner phone is not in Bluetooth or local network range');
      return {
        score: 'HIGH',
        reasons,
        recommendedAction: 'prompt_was_this_you',
      };
    }
    return {
      score: 'MEDIUM',
      reasons,
      recommendedAction: 'prompt_was_this_you',
    };
  }

  // Rule 5: Unknown presence state during unlock
  if (context.eventType === 'unlock' && context.presenceStatus === 'unknown') {
    return {
      score: 'MEDIUM',
      reasons: ['Laptop unlocked with indeterminate proximity state', 'Verify if this was legitimate usage'],
      recommendedAction: 'prompt_was_this_you',
    };
  }

  // Rule 6: Remote lock confirmations & Normal sleep/lock events
  if (context.eventType === 'lock' || context.eventType === 'sleep' || context.eventType === 'remote_lock_ack') {
    return {
      score: 'LOW',
      reasons: ['Device entered secure locked / sleep state'],
      recommendedAction: 'none',
    };
  }

  return {
    score: 'UNKNOWN',
    reasons: ['Telemetry state did not match active risk heuristics'],
    recommendedAction: 'none',
  };
}
