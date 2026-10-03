import assert from 'assert';
import test from 'node:test';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

// Mirroring the crypto functions under test
function canonicalJsonStringify(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalJsonStringify(item)).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const keyValues = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalJsonStringify(obj[key])}`
  );
  return '{' + keyValues.join(',') + '}';
}

function generateDeviceKeyPair() {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
    secretKey: Buffer.from(keyPair.secretKey).toString('base64'),
  };
}

function signPayload(payload, secretKeyBase64) {
  const secretKey = Buffer.from(secretKeyBase64, 'base64');
  const payloadStr = typeof payload === 'string' ? payload : canonicalJsonStringify(payload);
  const messageBytes = new TextEncoder().encode(payloadStr);
  const signatureBytes = nacl.sign.detached(messageBytes, secretKey);
  return Buffer.from(signatureBytes).toString('base64');
}

function verifySignature(payload, signatureBase64, publicKeyBase64) {
  try {
    const signature = Buffer.from(signatureBase64, 'base64');
    const publicKey = Buffer.from(publicKeyBase64, 'base64');
    const payloadStr = typeof payload === 'string' ? payload : canonicalJsonStringify(payload);
    const messageBytes = new TextEncoder().encode(payloadStr);
    return nacl.sign.detached.verify(messageBytes, signature, publicKey);
  } catch (err) {
    return false;
  }
}

function generateCommandNonce() {
  const timestamp = Date.now();
  const randomBytes = nacl.randomBytes(16);
  const randomHex = Buffer.from(randomBytes).toString('hex');
  return `${timestamp}-${randomHex}`;
}

function isNonceValid(nonce, maxAgeMs = 30000) {
  if (!nonce || typeof nonce !== 'string') return false;
  const parts = nonce.split('-');
  if (parts.length < 2) return false;
  const timestamp = parseInt(parts[0], 10);
  if (isNaN(timestamp)) return false;
  const now = Date.now();
  if (now - timestamp > maxAgeMs) return false;
  if (timestamp - now > 5000) return false;
  return true;
}

const consumedNonces = new Map();

function consumeNonce(nonce, maxAgeMs = 30000) {
  if (!isNonceValid(nonce, maxAgeMs)) return false;
  if (consumedNonces.has(nonce)) return false;
  const now = Date.now();
  consumedNonces.set(nonce, now);
  const cutoff = now - maxAgeMs;
  for (const [key, timestamp] of consumedNonces.entries()) {
    if (timestamp < cutoff) consumedNonces.delete(key);
  }
  return true;
}

test('Ed25519 Keypair Generation & Detached Signatures', () => {
  const keys = generateDeviceKeyPair();
  assert.ok(keys.publicKey.length > 0, 'Public key must not be empty');
  assert.ok(keys.secretKey.length > 0, 'Secret key must not be empty');

  const payload = { command: 'lock', deviceId: 'dev_123', nonce: generateCommandNonce() };
  const sig = signPayload(payload, keys.secretKey);
  assert.ok(sig.length > 0, 'Signature must not be empty');

  // Verify valid signature
  const isValid = verifySignature(payload, sig, keys.publicKey);
  assert.strictEqual(isValid, true, 'Valid signature should verify successfully');

  // Tamper payload
  const tamperedPayload = { ...payload, command: 'unlock' };
  const isTamperedValid = verifySignature(tamperedPayload, sig, keys.publicKey);
  assert.strictEqual(isTamperedValid, false, 'Tampered payload should fail signature verification');
});

test('Canonical JSON Key Sorting', () => {
  const obj1 = { b: 2, a: 1, c: { z: 10, y: 20 } };
  const obj2 = { a: 1, c: { y: 20, z: 10 }, b: 2 };
  assert.strictEqual(canonicalJsonStringify(obj1), canonicalJsonStringify(obj2));
});

test('Replay Attack & Monotonic Nonce Consumption', () => {
  const nonce = generateCommandNonce();
  assert.strictEqual(isNonceValid(nonce), true, 'Fresh nonce should be valid');

  // First consumption: success
  const firstConsume = consumeNonce(nonce);
  assert.strictEqual(firstConsume, true, 'First nonce execution must succeed');

  // Replay attempt: rejected
  const replayAttempt = consumeNonce(nonce);
  assert.strictEqual(replayAttempt, false, 'Replayed nonce must be rejected');

  // Expired nonce
  const expiredNonce = `${Date.now() - 40000}-deadbeef`;
  assert.strictEqual(consumeNonce(expiredNonce), false, 'Expired nonce must be rejected');
});
