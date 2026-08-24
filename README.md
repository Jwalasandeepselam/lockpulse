# LockPulse ⚡

> **Your laptop. Your control. Wherever you are.**  
> A personal laptop security control plane connecting **Mobile App ↔ Secure Backend ↔ Laptop Security Agent**.

---

## 🛡️ Core Philosophy & Security Boundaries

LockPulse is **NOT** a remote desktop application and **NOT** a surveillance software. It provides an out-of-band security control plane:

- **Zero Credential Storage:** Supabase never stores raw OS passwords, biometric hashes, or private cryptographic keys.
- **Device-Bound Cryptography:** The laptop agent generates local **Ed25519 keypairs** stored in OS-protected storage (**Windows DPAPI / TPM** or **macOS Keychain / Secure Enclave**).
- **Official OS Lock Hooks:** Remote lock triggers native platform lock screens (`user32!LockWorkStation` on Windows, `SACLockScreenImmediate` on macOS).
- **Replay Protection:** All commands require a monotonic nonce and a 30-second cryptographic TTL window.
- **Explainable Risk Engine:** Deterministic rule engine evaluating presence, telemetry, and time context.

---

## 🚀 Key Features

1. **Neumorphic Modern Design System:** Tactile cards, raised buttons, accessible contrast, color-coded security badges (Secure, Warning, Critical, Info).
2. **Interactive "Was This You?" Workflow:** Proactive push alert when a laptop is unlocked while the owner's phone is away, offering one-tap confirmation or immediate OS lockdown + Find My escalation.
3. **5-Step QR Pairing Wizard:** Cryptographic challenge pairing without static passwords.
4. **Activity & Audit Stream:** Immutable audit feed with JSON export.
5. **Sandboxed AI Security Assistant:** Zero-privilege security explainer and non-sensitive diagnostic ticket creator.
6. **Cross-Platform Security Agent:** Windows and macOS abstractions implementing the `PlatformAuthenticationProvider` interface.

---

## 🛠️ Quick Start

### 1. Run Web Control Center (Next.js)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to access the Landing Page or `/dashboard` to access the Security Control Center.

### 2. Run Laptop Security Agent Daemon (Simulator)

```bash
npm run agent:sim
```

### 3. Run Cryptographic & Risk Engine Test Suites

```bash
node tests/crypto.test.mjs
node tests/risk-engine.test.mjs
```

---

## 🗄️ Database Architecture (Supabase / PostgreSQL)

The complete SQL schema with Row-Level Security (RLS) policies is located at:
[`supabase/migrations/20260824000000_init_lockpulse.sql`](file:///supabase/migrations/20260824000000_init_lockpulse.sql)

---

## 📄 License
MIT License. © LockPulse Inc.
