import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        danger: "#dc2626",
        success: "#16a34a",
        warning: "#d97706",
        surface: "#f8fafc",
        border: "#e2e8f0",
        "text-primary": "#0f172a",
        "text-secondary": "#475569",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
