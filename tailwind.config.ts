import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0f0f23",
          raised: "#1a1a2e",
          overlay: "#16213e",
          card: "#1e1e3a",
        },
        brand: {
          DEFAULT: "#7c3aed",
          light: "#a78bfa",
          dark: "#5b21b6",
          glow: "rgba(124, 58, 237, 0.2)",
        },
        accent: {
          danger: "#ef4444",
          dangerGlow: "rgba(239, 68, 68, 0.2)",
          success: "#22c55e",
          successGlow: "rgba(34, 197, 94, 0.2)",
          warning: "#f59e0b",
          warningGlow: "rgba(245, 158, 11, 0.2)",
          info: "#3b82f6",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#94a3b8",
          muted: "#64748b",
          inverse: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      spacing: {
        "18": "4.5rem",
      },
      animation: {
        "fade-in": "fadeIn 200ms ease-out",
        "slide-up": "slideUp 250ms ease-out",
        "scale-in": "scaleIn 200ms ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(124, 58, 237, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
