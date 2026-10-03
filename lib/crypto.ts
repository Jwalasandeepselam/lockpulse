import nacl from 'tweetnacl';
import { Buffer } from 'buffer';

/**
 * KeyPair result containing base64-encoded Ed25519 public and secret keys.
 */
export interface Ed25519KeyPair {
  publicKey: string;
  secretKey: string;
}

/**
 * Deterministically sorts object keys recursively (RFC 8785 JSON Canonicalization).
 * Guarantees that stringified payloads are identical across different JS engines and platforms.
 */
export function canonicalJsonStringify(obj: any): string {
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

/**
 * Generates an Ed25519 cryptographic keypair locally on the client or laptop agent.
 * The secretKey MUST never leave the local device.
 */
export function generateDeviceKeyPair(): Ed25519KeyPair {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
    secretKey: Buffer.from(keyPair.secretKey).toString('base64'),
  };
}

/**
 * Signs an arbitrary string or object payload using the device's Ed25519 secret key.
 * Produces a detached base64 signature.
 */
export function signPayload(payload: string | object, secretKeyBase64: string): string {
  const secretKey = Buffer.from(secretKeyBase64, 'base64');
  const payloadStr = typeof payload === 'string' ? payload : canonicalJsonStringify(payload);
  const messageBytes = new TextEncoder().encode(payloadStr);
  const signatureBytes = nacl.sign.detached(messageBytes, secretKey);
  return Buffer.from(signatureBytes).toString('base64');
}

/**
 * Verifies a detached Ed25519 signature against a given payload and public key.
 */
export function verifySignature(
  payload: string | object,
  signatureBase64: string,
  publicKeyBase64: string
): boolean {
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

/**
 * Generates a high-entropy monotonic nonce containing timestamp + random bytes.
 * Format: `<timestamp_ms>-<hex_entropy>`
 */
export function generateCommandNonce(): string {
  const timestamp = Date.now();
  const randomBytes = nacl.randomBytes(16);
  const randomHex = Buffer.from(randomBytes).toString('hex');
  return `${timestamp}-${randomHex}`;
}

/**
 * Validates whether a given nonce falls within the allowed sliding time window (30s TTL).
 */
export function isNonceValid(nonce: string, maxAgeMs = 30000): boolean {
  if (!nonce || typeof nonce !== 'string') return false;
  const parts = nonce.split('-');
  if (parts.length < 2) return false;

  const timestamp = parseInt(parts[0], 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // Ensure timestamp is not older than maxAgeMs and not more than 5 seconds in the future
  if (now - timestamp > maxAgeMs) return false;
  if (timestamp - now > 5000) return false;

  return true;
}

/**
 * In-memory sliding-window cache for consumed nonces to prevent replay attacks on the agent/server.
 */
const consumedNonces = new Map<string, number>();

/**
 * Checks and records a nonce as consumed.
 * Rejects nonces that have already been executed or are out of the TTL window.
 */
export function consumeNonce(nonce: string, maxAgeMs = 30000): boolean {
  if (!isNonceValid(nonce, maxAgeMs)) return false;
  if (consumedNonces.has(nonce)) return false; // Replay attempt detected

  const now = Date.now();
  consumedNonces.set(nonce, now);

  // Evict expired nonces to maintain bounded memory
  const cutoff = now - maxAgeMs;
  for (const [key, timestamp] of consumedNonces.entries()) {
    if (timestamp < cutoff) {
      consumedNonces.delete(key);
    }
  }

  return true;
}
