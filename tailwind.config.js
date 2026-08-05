/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // preto quase puro (900-950) para fundo/superfícies, cinza claro (50-400)
        // para texto legível sobre esse fundo. 500-700 seguem escuros de propósito —
        // são usados só em borda/hover discreto, nunca em texto de leitura.
        ink: {
          50: "#f7f7f6",
          100: "#eae9e7",
          200: "#d6d4d1",
          300: "#b0aeaa",
          400: "#8f8d89",
          500: "#3a3a3a",
          600: "#262626",
          700: "#1a1a1a",
          800: "#121212",
          900: "#0a0a0a",
          950: "#050505",
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
