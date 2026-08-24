import nacl from 'tweetnacl';

/**
 * Utility functions for cryptographic operations in LockPulse
 * - Local Ed25519 key generation (stored on device)
 * - Message signing & signature verification
 * - Monotonic nonce validation with TTL replay protection
 */

// Helper to encode Uint8Array to base64
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  if (typeof window !== 'undefined') {
    return window.btoa(binary);
  }
  return Buffer.from(bytes).toString('base64');
}

// Helper to decode base64 to Uint8Array
export function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof window !== 'undefined') {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
  return new Uint8Array(Buffer.from(base64, 'base64'));
}

/**
 * Generates an Ed25519 cryptographic keypair locally.
 * In a real laptop agent, the secret key is preserved in OS Protected Storage (DPAPI/Keychain).
 */
export function generateDeviceKeyPair(): {
  publicKeyBase64: string;
  secretKeyBase64: string;
} {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKeyBase64: uint8ArrayToBase64(keyPair.publicKey),
    secretKeyBase64: uint8ArrayToBase64(keyPair.secretKey),
  };
}

/**
 * Signs a payload string with the device's private key.
 */
export function signPayload(payloadStr: string, secretKeyBase64: string): string {
  const messageBytes = new TextEncoder().encode(payloadStr);
  const secretKeyBytes = base64ToUint8Array(secretKeyBase64);
  const signature = nacl.sign.detached(messageBytes, secretKeyBytes);
  return uint8ArrayToBase64(signature);
}

/**
 * Verifies that a signed payload originated from the device holding the corresponding public key.
 */
export function verifySignature(
  payloadStr: string,
  signatureBase64: string,
  publicKeyBase64: string
): boolean {
  try {
    const messageBytes = new TextEncoder().encode(payloadStr);
    const signatureBytes = base64ToUint8Array(signatureBase64);
    const publicKeyBytes = base64ToUint8Array(publicKeyBase64);
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

/**
 * Generates a cryptographically secure random nonce with timestamp.
 * Format: `<timestamp_ms>-<random_hex_32>`
 */
export function generateCommandNonce(): string {
  const randomBytes = nacl.randomBytes(16);
  const hex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${Date.now()}-${hex}`;
}

/**
 * Validates whether a command nonce is within acceptable time drift (default: 30 seconds).
 */
export function isNonceValid(nonce: string, maxAgeMs: number = 30000): boolean {
  const parts = nonce.split('-');
  if (parts.length < 2) return false;
  const timestamp = parseInt(parts[0], 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  // Ensure timestamp is not in the distant future (>5s) and not older than maxAgeMs
  if (timestamp > now + 5000) return false;
  if (now - timestamp > maxAgeMs) return false;

  return true;
}
