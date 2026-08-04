/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // preto quase puro, para o fundo e superfícies elevadas
        ink: {
          950: "#050505",
          900: "#0a0a0a",
          800: "#121212",
          700: "#1a1a1a",
          600: "#262626",
          500: "#3a3a3a",
        },
        // vinho — cor de destaque única (CTA, foco, marca)
        wine: {
          50: "#fbeaee",
          100: "#f3ccd5",
          200: "#e59bab",
          300: "#d16b83",
          400: "#af3f57",
          500: "#8a2540",
          600: "#6e1a33",
          700: "#57132a",
          800: "#400e1f",
          900: "#2c0916",
          950: "#1a050c",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
