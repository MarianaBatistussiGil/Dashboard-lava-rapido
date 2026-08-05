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
        // azul — cor de destaque única (CTA, foco, marca), extraída da logo real
        // (src/app/assets/image.png): navy predominante ~#003282, destaque vívido
        // ~#46aaf0. blue-400 e blue-800 abaixo batem quase exato com essas duas.
        blue: {
          50: "#eef6fe",
          100: "#d7ecfd",
          200: "#aed7fb",
          300: "#7cbdf5",
          400: "#4aa2ee",
          500: "#2b82dd",
          600: "#1663c2",
          700: "#0d489a",
          800: "#0a3576",
          900: "#072452",
          950: "#041331",
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
