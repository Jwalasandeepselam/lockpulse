import assert from 'assert';
import test from 'node:test';

function evaluateRisk(input) {
  const { eventType, presenceStatus, metadata, context = {} } = input;
  const hour = context.hourOfDay ?? new Date().getHours();
  const isLateNight = hour >= 23 || hour <= 5;
  const isKnownNetwork = context.isKnownNetwork ?? true;

  if (eventType === 'unlock') {
    if (presenceStatus === 'away') {
      return {
        score: 'HIGH',
        reason: 'Laptop unlocked while registered companion phone appears away from device area.',
        requiresImmediateAlert: true,
        recommendedAction: 'send_was_this_you',
      };
    }
    if (presenceStatus === 'unknown') {
      return {
        score: isLateNight ? 'MEDIUM' : 'LOW',
        reason: isLateNight
          ? 'Device unlocked during late-night hours without confirmed companion phone proximity.'
          : 'Unlock event recorded with companion proximity undetermined.',
        requiresImmediateAlert: isLateNight,
        recommendedAction: isLateNight ? 'send_was_this_you' : 'none',
      };
    }
    return {
      score: 'LOW',
      reason: 'Legitimate unlock with confirmed owner companion proximity nearby.',
      requiresImmediateAlert: false,
      recommendedAction: 'none',
    };
  }

  if (eventType === 'failed_login') {
    const attempts = metadata?.consecutive_attempts ?? 1;
    if (attempts >= 3) {
      return {
        score: 'HIGH',
        reason: `Multiple consecutive failed authentication attempts (${attempts}) detected.`,
        requiresImmediateAlert: true,
        recommendedAction: 'send_security_alert',
      };
    }
    return {
      score: 'MEDIUM',
      reason: 'Single failed authentication attempt recorded.',
      requiresImmediateAlert: false,
      recommendedAction: 'none',
    };
  }

  return {
    score: 'LOW',
    reason: 'Standard device operational telemetry event.',
    requiresImmediateAlert: false,
    recommendedAction: 'none',
  };
}

test('Risk Engine: Away + Unlock triggers HIGH risk', () => {
  const result = evaluateRisk({
    eventType: 'unlock',
    presenceStatus: 'away',
  });
  assert.strictEqual(result.score, 'HIGH');
  assert.strictEqual(result.requiresImmediateAlert, true);
  assert.strictEqual(result.recommendedAction, 'send_was_this_you');
});

test('Risk Engine: Nearby + Unlock produces LOW risk', () => {
  const result = evaluateRisk({
    eventType: 'unlock',
    presenceStatus: 'nearby',
  });
  assert.strictEqual(result.score, 'LOW');
  assert.strictEqual(result.requiresImmediateAlert, false);
});

test('Risk Engine: Failed Login escalation', () => {
  const single = evaluateRisk({
    eventType: 'failed_login',
    presenceStatus: 'nearby',
    metadata: { consecutive_attempts: 1 },
  });
  assert.strictEqual(single.score, 'MEDIUM');

  const multiple = evaluateRisk({
    eventType: 'failed_login',
    presenceStatus: 'nearby',
    metadata: { consecutive_attempts: 3 },
  });
  assert.strictEqual(multiple.score, 'HIGH');
  assert.strictEqual(multiple.requiresImmediateAlert, true);
});
