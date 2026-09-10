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
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
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
