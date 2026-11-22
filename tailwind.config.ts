import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--md-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--md-on-primary) / <alpha-value>)",
        "primary-container": "rgb(var(--md-primary-container) / <alpha-value>)",
        "on-primary-container": "rgb(var(--md-on-primary-container) / <alpha-value>)",
        secondary: "rgb(var(--md-secondary) / <alpha-value>)",
        tertiary: "rgb(var(--md-tertiary) / <alpha-value>)",
        surface: "rgb(var(--md-surface) / <alpha-value>)",
        "on-surface": "rgb(var(--md-on-surface) / <alpha-value>)",
        "surface-variant": "rgb(var(--md-surface-variant) / <alpha-value>)",
        outline: "rgb(var(--md-outline) / <alpha-value>)",
        error: "rgb(var(--md-error) / <alpha-value>)",
      },
      fontFamily: {
        heading: ["Cinzel", "Philosopher", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { m3: "12px", "m3-lg": "16px", "m3-xl": "28px" },
      boxShadow: {
        m3: "0 1px 2px rgb(0 0 0 / .12), 0 1px 3px 1px rgb(0 0 0 / .08)",
        "m3-2": "0 1px 2px rgb(0 0 0 / .12), 0 2px 6px 2px rgb(0 0 0 / .08)",
      },
    },
  },
  plugins: [],
};
export default config;
