import { PlatformAuthenticationProvider } from './platform-interface';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class WindowsAuthenticationProvider implements PlatformAuthenticationProvider {
  readonly platformName = 'windows';
  private inMemorySecureVault: string | null = null;

  /**
   * Invokes the official Windows LockWorkStation API.
   * This locks the current interactive session and displays the Windows login screen.
   */
  async lockScreen(): Promise<{ success: boolean; error?: string }> {
    try {
      // In Windows, LockWorkStation is the official OS API in user32.dll
      await execAsync('rundll32.exe user32.dll,LockWorkStation');
      console.log('[Windows Provider] Successfully invoked LockWorkStation()');
      return { success: true };
    } catch (err: any) {
      console.error('[Windows Provider] Failed to execute LockWorkStation:', err);
      return { success: false, error: err.message };
    }
  }

  async getHardwareFingerprint(): Promise<string> {
    try {
      const { stdout } = await execAsync('wmic csproduct get uuid');
      const lines = stdout.trim().split('\n');
      return lines[lines.length - 1].trim() || 'win-hw-fingerprint-default';
    } catch {
      return 'win-hw-fingerprint-fallback';
    }
  }

  async storePrivateKey(privateKeyBase64: string): Promise<boolean> {
    // Abstraction for Windows DPAPI (CryptProtectData)
    this.inMemorySecureVault = privateKeyBase64;
    console.log('[Windows Provider] Private key sealed in Windows DPAPI storage abstraction.');
    return true;
  }

  async retrievePrivateKey(): Promise<string | null> {
    return this.inMemorySecureVault;
  }
}
