import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        kraft: {
          50: "#fdf8f1",
          100: "#f7ecd9",
          200: "#efd6ad",
          300: "#e4ba7c",
          400: "#d89e54",
          500: "#c9842f",
          600: "#ad6624",
          700: "#8a4c20",
          800: "#713e20",
          900: "#5f341d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1200px",
        },
      },
    },
  },
  plugins: [],
};

export default config;
