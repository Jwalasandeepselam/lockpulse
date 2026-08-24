import assert from 'assert';
import nacl from 'tweetnacl';

function uint8ArrayToBase64(bytes) {
  return Buffer.from(bytes).toString('base64');
}

function base64ToUint8Array(base64) {
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

function generateDeviceKeyPair() {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKeyBase64: uint8ArrayToBase64(keyPair.publicKey),
    secretKeyBase64: uint8ArrayToBase64(keyPair.secretKey),
  };
}

function signPayload(payloadStr, secretKeyBase64) {
  const messageBytes = new TextEncoder().encode(payloadStr);
  const secretKeyBytes = base64ToUint8Array(secretKeyBase64);
  const signature = nacl.sign.detached(messageBytes, secretKeyBytes);
  return uint8ArrayToBase64(signature);
}

function verifySignature(payloadStr, signatureBase64, publicKeyBase64) {
  try {
    const messageBytes = new TextEncoder().encode(payloadStr);
    const signatureBytes = base64ToUint8Array(signatureBase64);
    const publicKeyBytes = base64ToUint8Array(publicKeyBase64);
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch {
    return false;
  }
}

function isNonceValid(nonce, maxAgeMs = 30000) {
  const parts = nonce.split('-');
  if (parts.length < 2) return false;
  const timestamp = parseInt(parts[0], 10);
  if (isNaN(timestamp)) return false;
  const now = Date.now();
  if (timestamp > now + 5000) return false;
  if (now - timestamp > maxAgeMs) return false;
  return true;
}

console.log('Running LockPulse Crypto & Replay Attack Tests...');

// 1. Keypair Generation & Signature Verification
const { publicKeyBase64, secretKeyBase64 } = generateDeviceKeyPair();
const testCommand = JSON.stringify({ command: 'LOCK', deviceId: 'dev-123', nonce: `${Date.now()}-abc` });
const signature = signPayload(testCommand, secretKeyBase64);

assert.strictEqual(verifySignature(testCommand, signature, publicKeyBase64), true, 'Valid signature should verify');
assert.strictEqual(verifySignature(testCommand + 'tampered', signature, publicKeyBase64), false, 'Tampered payload should fail verification');

// 2. Monotonic Nonce Replay Protection Tests
const validNonce = `${Date.now()}-nonce1`;
assert.strictEqual(isNonceValid(validNonce), true, 'Fresh nonce within TTL should be valid');

const expiredNonce = `${Date.now() - 35000}-expired`;
assert.strictEqual(isNonceValid(expiredNonce), false, 'Expired nonce (>30s) must be rejected');

const futureNonce = `${Date.now() + 10000}-future`;
assert.strictEqual(isNonceValid(futureNonce), false, 'Far-future nonce (>5s) must be rejected');

console.log('✓ All Crypto & Replay Protection tests passed successfully!');
