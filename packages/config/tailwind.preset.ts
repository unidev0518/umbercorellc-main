import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const preset: Partial<Config> = {
  darkMode: ["class"],
  plugins: [tailwindcssAnimate],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "hsl(var(--brand-primary) / <alpha-value>)",
          green: "hsl(var(--brand-green) / <alpha-value>)",
          "green-soft": "hsl(var(--brand-green-soft) / <alpha-value>)",
          blue: "hsl(var(--brand-blue) / <alpha-value>)",
          "blue-soft": "hsl(var(--brand-blue-soft) / <alpha-value>)",
          accent: "hsl(var(--brand-accent) / <alpha-value>)",
          "accent-soft": "hsl(var(--brand-accent-soft) / <alpha-value>)",
          secondary: "hsl(var(--brand-secondary) / <alpha-value>)",
          glow: "hsl(var(--brand-glow) / <alpha-value>)",
          danger: "hsl(var(--brand-danger) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "hsl(var(--surface-default) / <alpha-value>)",
          default: "hsl(var(--surface-default) / <alpha-value>)",
          elevated: "hsl(var(--surface-elevated) / <alpha-value>)",
          dark: "hsl(var(--surface-dark) / <alpha-value>)",
          mid: "hsl(var(--surface-mid) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        success: "hsl(var(--success) / <alpha-value>)",
        warning: "hsl(var(--warning) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, hsl(204 70% 96%) 0%, hsl(199 60% 94%) 50%, hsl(207 55% 95%) 100%)",
        "gradient-hero":
          "radial-gradient(ellipse 80% 60% at 15% 0%, hsl(199 88% 52% / 0.22), transparent 55%), radial-gradient(ellipse 60% 50% at 85% 5%, hsl(207 78% 48% / 0.16), transparent 50%), linear-gradient(180deg, hsl(204 70% 97%) 0%, hsl(204 55% 95%) 100%)",
        "gradient-mesh":
          "radial-gradient(at 30% 20%, hsl(199 88% 52% / 0.16) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(207 78% 48% / 0.12) 0px, transparent 50%), radial-gradient(at 0% 60%, hsl(204 50% 70% / 0.14) 0px, transparent 50%)",
        "gradient-footer":
          "linear-gradient(90deg, hsl(var(--brand-green)), hsl(var(--brand-blue)), hsl(var(--brand-green)))",
        "gradient-text":
          "linear-gradient(135deg, hsl(var(--brand-green-soft)) 0%, hsl(var(--brand-blue)) 100%)",
        "gradient-card":
          "linear-gradient(145deg, hsl(0 0% 100%) 0%, hsl(204 55% 97%) 100%)",
        "gradient-threat":
          "radial-gradient(circle, hsl(8 68% 52% / 0.2) 0%, transparent 70%)",
        "gradient-shield":
          "radial-gradient(circle, hsl(207 78% 48% / 0.18) 0%, transparent 70%)",
      },
      boxShadow: {
        card: "0 8px 24px -10px rgba(18, 72, 130, 0.14)",
        elevated: "0 18px 40px -16px rgba(18, 72, 130, 0.18)",
        glow: "0 8px 28px -8px hsl(207 78% 40% / 0.35)",
        "glow-blue": "0 8px 28px -8px hsl(199 88% 46% / 0.35)",
        "glow-lg": "0 12px 36px -12px hsl(207 78% 40% / 0.28)",
        "glow-threat": "0 8px 28px -10px hsl(8 68% 52% / 0.28)",
        inner: "inset 0 1px 0 0 hsl(0 0% 100% / 0.8)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        "gradient-x": "gradient-x 8s ease infinite",
        attack: "attack 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        attack: {
          "0%, 100%": { transform: "translateX(0)", opacity: "0.6" },
          "50%": { transform: "translateX(8px)", opacity: "1" },
        },
      },
    },
  },
};

export default preset;
