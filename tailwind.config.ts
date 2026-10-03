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

        // Theme 2: Apple Enclave & Alpine Titanium Palette
        primary: {
          DEFAULT: "#0066CC", // Apple Royal Blue
          hover: "#0052A3",
          azure: "#2997FF",   // Apple Azure
          container: "#0066CC",
          fixed: "#E5F1FF",
          "fixed-dim": "#CCE3FF",
          dark: "#004499",
        },
        secondary: {
          DEFAULT: "#30D158", // Apple Mint (Secure / Success)
          hover: "#28B84C",
          container: "#30D158",
          "container-dark": "#248A3D",
          fixed: "#E8FBEF",
          "fixed-dim": "#C3F5D6",
        },
        tertiary: {
          DEFAULT: "#FF9F0A", // Apple Warning Amber
          hover: "#E08B00",
          container: "#FF9F0A",
          fixed: "#FFF5E5",
          "fixed-dim": "#FFE4B8",
        },
        error: {
          DEFAULT: "#FF453A", // Apple Coral Red (Critical / Danger)
          hover: "#D70015",
          container: "#FFEBEA",
          dark: "#C91910",
        },
        starlight: "#F5F5F7",  // Apple Starlight Off-White
        ink: {
          DEFAULT: "#1D1D1F", // Apple macOS Ink
          muted: "#6E6E73",
          subtle: "#86868B",
        },
        titanium: {
          50: "#FAFAFC",
          100: "#F5F5F7",
          200: "#E5E5EA",
          300: "#D1D1D6",
          400: "#A1A1A6",
          500: "#6E6E73",
          600: "#48484A",
          700: "#2C2C2E",
          800: "#1C1C1E",
          900: "#121214",
          950: "#0D0E12",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          bright: "#FFFFFF",
          dim: "#E5E5EA",
          container: "var(--color-surface-container)",
          "container-low": "var(--color-surface-container-low)",
          "container-lowest": "var(--color-surface-container-lowest)",
          "container-high": "var(--color-surface-container-high)",
          "container-highest": "var(--color-surface-container-highest)",
          variant: "var(--color-surface-variant)",
          tint: "#0066CC",
        },
        "on-surface": {
          DEFAULT: "var(--color-on-surface)",
          variant: "var(--color-on-surface-variant)",
        },
        outline: {
          DEFAULT: "var(--color-outline)",
          variant: "var(--color-outline-variant)",
        },
        "inverse-surface": "var(--color-inverse-surface)",
        "inverse-on-surface": "var(--color-inverse-on-surface)",
        "inverse-primary": "#2997FF",

        // Security semantic mapping
        security: {
          secure: "#30D158",
          warning: "#FF9F0A",
          danger: "#FF453A",
          info: "#2997FF",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        "neu-raised": "var(--neu-shadow-raised)",
        "neu-raised-sm": "var(--neu-shadow-raised-sm)",
        "neu-raised-lg": "var(--neu-shadow-raised-lg)",
        "neu-recessed": "var(--neu-shadow-recessed)",
        "neu-recessed-deep": "var(--neu-shadow-recessed-deep)",
        "neu-button": "var(--neu-shadow-button)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)",
        titanium: "0 10px 30px -5px rgba(0, 102, 204, 0.15), 0 0 1px 1px rgba(0, 0, 0, 0.05)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "card-gap": "32px",
        "container-padding-mobile": "20px",
        "container-padding-desktop": "40px",
        unit: "8px",
        gutter: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
