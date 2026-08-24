import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: {
          light: "#EEF2F6",
          dark: "#0B1120",
        },
        surface: {
          light: "#E2E8F0",
          card: "#E9EFF6",
          dark: "#131C2E",
          darkcard: "#182238",
        },
        pulse: {
          blue: "#0284C7",
          cyan: "#0EA5E9",
          sky: "#38BDF8",
          darkblue: "#0369A1",
        },
        security: {
          secure: "#10B981",
          "secure-dark": "#059669",
          warning: "#F59E0B",
          "warning-dark": "#D97706",
          danger: "#EF4444",
          "danger-dark": "#DC2626",
          info: "#3B82F6",
          "info-dark": "#1D4ED8",
        },
      },
      boxShadow: {
        "neo-flat": "6px 6px 14px rgba(166, 180, 200, 0.45), -6px -6px 14px rgba(255, 255, 255, 0.95)",
        "neo-raised": "10px 10px 22px rgba(160, 175, 198, 0.5), -10px -10px 22px rgba(255, 255, 255, 0.98)",
        "neo-floating": "14px 14px 28px rgba(155, 170, 195, 0.55), -14px -14px 28px rgba(255, 255, 255, 1)",
        "neo-sm": "3px 3px 7px rgba(166, 180, 200, 0.4), -3px -3px 7px rgba(255, 255, 255, 0.9)",
        "neo-pressed": "inset 4px 4px 8px rgba(155, 170, 195, 0.45), inset -4px -4px 8px rgba(255, 255, 255, 0.85)",
        "neo-pressed-sm": "inset 2px 2px 5px rgba(155, 170, 195, 0.4), inset -2px -2px 5px rgba(255, 255, 255, 0.8)",
        "neo-convex": "5px 5px 12px rgba(160, 175, 198, 0.4), -5px -5px 12px rgba(255, 255, 255, 0.9)",
        
        // Dark Mode Neumorphic Shadows
        "neo-dark-flat": "6px 6px 14px rgba(5, 8, 16, 0.7), -6px -6px 14px rgba(26, 38, 62, 0.4)",
        "neo-dark-raised": "10px 10px 22px rgba(4, 7, 14, 0.8), -10px -10px 22px rgba(28, 42, 68, 0.45)",
        "neo-dark-pressed": "inset 4px 4px 8px rgba(5, 8, 16, 0.85), inset -4px -4px 8px rgba(26, 38, 62, 0.35)",
        
        // Glows
        "glow-secure": "0 0 20px rgba(16, 185, 129, 0.45)",
        "glow-danger": "0 0 22px rgba(239, 68, 68, 0.5)",
        "glow-warning": "0 0 20px rgba(245, 158, 11, 0.45)",
        "glow-accent": "0 0 20px rgba(14, 165, 233, 0.45)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Space Grotesk", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["monospace"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.04)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2.5s infinite ease-in-out",
        "radar-sweep": "radarSweep 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
