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
        palette: {
          white: "#FFFFFF",
          canvas: "#F5F5F5",
          sand: "#D6D4CE",
          "sand-light": "#E8E6E0",
          ash: "#7E7A7A",
          charcoal: "#4E4B4B",
          black: "#1E1D1D",
        },
        surface: {
          light: "#FFFFFF",
          card: "#FFFFFF",
          dark: "#222020",
          darkcard: "#222020",
        },
        pulse: {
          blue: "#1E1D1D",
          cyan: "#4E4B4B",
          sky: "#7E7A7A",
          darkblue: "#0E0D0D",
        },
        security: {
          secure: "#10B981",
          "secure-dark": "#059669",
          warning: "#F59E0B",
          "warning-dark": "#D97706",
          danger: "#DC2626",
          "danger-dark": "#991B1B",
          info: "#4E4B4B",
          "info-dark": "#1E1D1D",
        },
      },
      boxShadow: {
        "editorial-sm": "0 2px 8px rgba(30, 29, 29, 0.04), 0 1px 2px rgba(30, 29, 29, 0.02)",
        "editorial-md": "0 8px 24px -4px rgba(30, 29, 29, 0.06), 0 2px 6px -1px rgba(30, 29, 29, 0.04)",
        "editorial-lg": "0 16px 36px -6px rgba(30, 29, 29, 0.08), 0 4px 12px -2px rgba(30, 29, 29, 0.05)",
        "editorial-hover": "0 20px 40px -8px rgba(30, 29, 29, 0.12), 0 6px 16px -2px rgba(30, 29, 29, 0.06)",
        "editorial-inset": "inset 0 2px 4px rgba(30, 29, 29, 0.05)",
        
        // Neo variants updated for palette
        "neo-flat": "0 4px 16px rgba(126, 122, 122, 0.08), 0 1px 3px rgba(126, 122, 122, 0.04)",
        "neo-raised": "0 10px 28px rgba(126, 122, 122, 0.1), 0 2px 6px rgba(126, 122, 122, 0.05)",
        "neo-floating": "0 20px 40px rgba(126, 122, 122, 0.14)",
        "neo-pressed": "inset 0 2px 5px rgba(30, 29, 29, 0.06)",
        
        // Glows
        "glow-secure": "0 0 16px rgba(16, 185, 129, 0.35)",
        "glow-danger": "0 0 18px rgba(220, 38, 38, 0.35)",
        "glow-warning": "0 0 16px rgba(245, 158, 11, 0.35)",
        "glow-accent": "0 0 16px rgba(78, 75, 75, 0.35)",
      },
      fontFamily: {
        sans: ["Epilogue", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        heading: ["Anton", "sans-serif"],
        anton: ["Anton", "sans-serif"],
        epilogue: ["Epilogue", "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
