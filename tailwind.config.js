// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7E6CB",
        gold: {
          DEFAULT: "#B8860B",
          light: "#D4AF37",
          dark: "#8B6914",
        },
        ink: "#2B2B2B",
        cocoa: "#8B5E3C",
        cloud: "#FFFFFF",
        // Paleta neutra exclusiva do modo Admin — SaaS limpo, sem dourado dominante.
        slate: {
          50: "#F8F9FA",
          100: "#F1F2F4",
          200: "#E4E6E9",
          500: "#6B7280",
        },
        success: { DEFAULT: "#2E7D4F", bg: "#EAF6EF" },
        warning: { DEFAULT: "#9A6B12", bg: "#FBF3DF" },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["2.5rem", { lineHeight: "1.1" }],
        "display-lg": ["2rem", { lineHeight: "1.15" }],
        "display-md": ["1.5rem", { lineHeight: "1.2" }],
      },
      boxShadow: {
        // Uso restrito a Loja/Conta. O modo Admin não usa sombra — ver seção "borda" abaixo.
        card: "0 4px 20px -4px rgba(43, 43, 43, 0.08)",
        drawer: "-8px 0 30px -8px rgba(43, 43, 43, 0.15)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};