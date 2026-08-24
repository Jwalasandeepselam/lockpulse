/**
 * PlatformAuthenticationProvider
 * Shared cross-platform abstraction for Windows and macOS security APIs.
 */
export interface PlatformAuthenticationProvider {
  /**
   * The platform identifier ('windows' | 'macos' | 'linux')
   */
  readonly platformName: 'windows' | 'macos' | 'linux';

  /**
   * Executes the native OS lock screen API immediately without bypassing OS security.
   * - Windows: user32.dll -> LockWorkStation()
   * - macOS: /System/Library/CoreServices/Menu Extras/User.menu/... -> SACLockScreenImmediate()
   */
  lockScreen(): Promise<{ success: boolean; error?: string }>;

  /**
   * Retrieves secure device metadata & hardware fingerprint.
   */
  getHardwareFingerprint(): Promise<string>;

  /**
   * Stores the Ed25519 private key in OS-protected storage:
   * - Windows: DPAPI (CryptProtectData) or Credential Guard
   * - macOS: Apple Keychain / Secure Enclave
   */
  storePrivateKey(privateKeyBase64: string): Promise<boolean>;

  /**
   * Retrieves the Ed25519 private key from OS-protected storage.
   */
  retrievePrivateKey(): Promise<string | null>;
}
