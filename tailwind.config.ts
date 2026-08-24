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
        
        // Stitch Material Design Palette
        primary: {
          DEFAULT: "#0040e0",
          container: "#2e5bff",
          fixed: "#dde1ff",
          "fixed-dim": "#b8c3ff",
          dark: "#0035be",
        },
        secondary: {
          DEFAULT: "#006c49",
          container: "#6cf8bb",
          "container-dark": "#10b981",
          fixed: "#6ffbbe",
          "fixed-dim": "#4edea3",
        },
        tertiary: {
          DEFAULT: "#784b00",
          container: "#f59e0b",
          fixed: "#ffddb8",
          "fixed-dim": "#ffb95f",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          dark: "#93000a",
        },
        surface: {
          DEFAULT: "#fbf8ff",
          bright: "#fbf8ff",
          dim: "#d9d9e6",
          container: "#ededfa",
          "container-low": "#f3f2ff",
          "container-lowest": "#ffffff",
          "container-high": "#e7e7f4",
          "container-highest": "#e2e1ef",
          variant: "#e2e1ef",
          tint: "#124af0",
        },
        "on-surface": {
          DEFAULT: "#191b24",
          variant: "#434656",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#efefff",
          fixed: "#001356",
          "fixed-variant": "#0035be",
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#00714d",
          fixed: "#002113",
          "fixed-variant": "#005236",
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#ffeedd",
          fixed: "#2a1700",
          "fixed-variant": "#653e00",
        },
        "on-error": {
          DEFAULT: "#ffffff",
          container: "#93000a",
        },
        outline: {
          DEFAULT: "#747688",
          variant: "#c4c5d9",
        },
        "inverse-surface": "#2e303a",
        "inverse-on-surface": "#f0effd",
        "inverse-primary": "#b8c3ff",

        // Security semantic mapping
        security: {
          secure: "#10b981",
          warning: "#f59e0b",
          danger: "#ba1a1a",
          info: "#2e5bff",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Space Grotesk", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["Space Grotesk", "monospace"],
      },
      boxShadow: {
        "neu-raised": "8px 8px 16px #d9d9e6, -8px -8px 16px #ffffff",
        "neu-raised-sm": "4px 4px 8px #d9d9e6, -4px -4px 8px #ffffff",
        "neu-raised-lg": "12px 12px 24px #d2d2df, -12px -12px 24px #ffffff",
        "neu-recessed": "inset 4px 4px 8px #d9d9e6, inset -4px -4px 8px #ffffff",
        "neu-recessed-deep": "inset 6px 6px 12px #d2d2df, inset -6px -6px 12px #ffffff",
        "neu-button": "4px 4px 10px rgba(0, 64, 224, 0.25), -4px -4px 10px rgba(255, 255, 255, 0.7)",
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
