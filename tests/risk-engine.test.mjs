import assert from 'assert';

function evaluateRisk(context) {
  const reasons = [];
  const hour = context.hourOfDay ?? new Date().getHours();
  const isUnusualHour = hour < 6 || hour >= 23;

  if (context.presenceStatus === 'nearby') {
    if (context.eventType === 'unlock' || context.eventType === 'wake' || context.eventType === 'lock') {
      return {
        score: 'LOW',
        reasons: ['Owner phone verified nearby via local proximity signal'],
        recommendedAction: 'none',
      };
    }
  }

  if (context.eventType === 'login_fail' || (context.failedAttemptsCount && context.failedAttemptsCount > 0)) {
    reasons.push(`Failed login attempt detected`);
    if (context.presenceStatus === 'away') {
      reasons.push('Owner phone is currently away');
      return { score: 'HIGH', reasons, recommendedAction: 'immediate_lock' };
    }
    return { score: 'MEDIUM', reasons, recommendedAction: 'verify_identity' };
  }

  if (context.eventType === 'unlock' && context.presenceStatus === 'away') {
    reasons.push('Laptop was unlocked while registered phone appears to be away');
    if (isUnusualHour) {
      reasons.push(`Activity occurred at unusual hour (${hour}:00)`);
      return { score: 'HIGH', reasons, recommendedAction: 'prompt_was_this_you' };
    }
    return { score: 'MEDIUM', reasons, recommendedAction: 'prompt_was_this_you' };
  }

  if (context.eventType === 'lock' || context.eventType === 'sleep' || context.eventType === 'remote_lock_ack') {
    return { score: 'LOW', reasons: ['Device entered secure locked / sleep state'], recommendedAction: 'none' };
  }

  return { score: 'UNKNOWN', reasons: ['Default baseline'], recommendedAction: 'none' };
}

console.log('Running LockPulse Deterministic Risk Engine Tests...');

// Test 1: Routine unlock with owner nearby
const test1 = evaluateRisk({ eventType: 'unlock', presenceStatus: 'nearby' });
assert.strictEqual(test1.score, 'LOW', 'Owner nearby during unlock must be LOW risk');

// Test 2: Unlock while owner is away during daytime
const test2 = evaluateRisk({ eventType: 'unlock', presenceStatus: 'away', hourOfDay: 14 });
assert.strictEqual(test2.score, 'MEDIUM', 'Unlock while away must trigger MEDIUM risk');
assert.strictEqual(test2.recommendedAction, 'prompt_was_this_you', 'Must recommend prompt_was_this_you');

// Test 3: Unlock while owner is away at 2 AM (Unusual hour)
const test3 = evaluateRisk({ eventType: 'unlock', presenceStatus: 'away', hourOfDay: 2 });
assert.strictEqual(test3.score, 'HIGH', 'Unlock while away at 2 AM must trigger HIGH risk');
assert.strictEqual(test3.recommendedAction, 'prompt_was_this_you', 'Must recommend prompt_was_this_you');

// Test 4: Failed login attempt while away
const test4 = evaluateRisk({ eventType: 'login_fail', presenceStatus: 'away' });
assert.strictEqual(test4.score, 'HIGH', 'Failed login while away must be HIGH risk');
assert.strictEqual(test4.recommendedAction, 'immediate_lock', 'Must recommend immediate_lock');

console.log('✓ All Risk Engine heuristic tests passed successfully!');
