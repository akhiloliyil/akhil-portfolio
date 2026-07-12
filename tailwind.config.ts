import type { Config } from "tailwindcss";

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./frontend/**/*.{ts,tsx}",
    "./backend/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: rgb("--paper"),
        panel: rgb("--panel"),
        ink: rgb("--ink"),
        inkmuted: rgb("--inkmuted"),
        line: rgb("--line"),
        accent: rgb("--accent"),
        coral: rgb("--coral"),
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        grid:
          "linear-gradient(to right, rgb(var(--line)) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--line)) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
