import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#0D0D0D",
          charcoal: "#1A1A1A",
          gold: "#C9A14A",
          "gold-light": "#E5C17A",
          "gold-dark": "#8B6F3D",
          ivory: "#F9F6F0",
          "ivory-dark": "#E8E5DF",
          emerald: "#043927",
          "emerald-light": "#065A44",
          burgundy: "#660000",
          "burgundy-light": "#8B0000",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "var(--font-playfair)", "serif"],
        display: ["var(--font-cinzel)", "var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 8px 32px rgba(201, 161, 74, 0.2)",
        "luxury-lg": "0 20px 60px rgba(201, 161, 74, 0.3)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
    },
  },
};

export default config;
