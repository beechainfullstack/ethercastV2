import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#050507",
        veil: "#101012",
        accent: "#f5f5f5",
        muted: "#6b7280",
        error: "#f87171"
      },
      fontFamily: {
        sans: ["system-ui", "ui-sans-serif", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "monospace"]
      },
      letterSpacing: {
        widerish: "0.25em"
      }
    }
  },
  plugins: []
};

export default config;
