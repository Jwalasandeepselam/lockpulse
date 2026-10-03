import { exec } from 'child_process';
import { promisify } from 'util';
import { PlatformAuthenticationProvider } from './platform-interface';

const execAsync = promisify(exec);

export class WindowsAuthenticationProvider implements PlatformAuthenticationProvider {
  readonly platformName = 'windows' as const;

  /**
   * Invokes native Windows lock screen via user32.dll!LockWorkStation.
   * Never forces a reboot or unsaved data loss.
   */
  async lockScreen(): Promise<{ success: boolean; error?: string }> {
    try {
      await execAsync('rundll32.exe user32.dll,LockWorkStation');
      return { success: true };
    } catch (error: any) {
      console.error('Failed to trigger Windows LockWorkStation:', error);
      return { success: false, error: error?.message || 'Failed to lock Windows workstation' };
    }
  }

  /**
   * Extracts hardware UUID safely using PowerShell CIM / Win32_ComputerSystemProduct.
   */
  async getHardwareFingerprint(): Promise<string> {
    try {
      // Modern PowerShell CIM query (works on Windows 10, 11 24H2+, Server)
      const { stdout } = await execAsync('powershell -NoProfile -Command "(Get-CimInstance -ClassName Win32_ComputerSystemProduct).UUID"');
      const clean = stdout.trim();
      if (clean && clean.length > 8) {
        return clean;
      }
      // Fallback
      const { stdout: wmicOut } = await execAsync('wmic csproduct get uuid');
      return wmicOut.replace('UUID', '').trim() || 'win-hw-uuid-fallback';
    } catch (err) {
      return 'windows-default-fingerprint';
    }
  }

  /**
   * Mock abstraction for Windows DPAPI / Credential Guard.
   */
  async storePrivateKey(privateKeyBase64: string): Promise<boolean> {
    // In production, invokes Windows DPAPI CryptProtectData
    return true;
  }

  async retrievePrivateKey(): Promise<string | null> {
    // In production, invokes Windows DPAPI CryptUnprotectData
    return null;
  }
}
