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
        // vinho — cor de destaque única (CTA, foco, marca). Voltou a ser vermelho a
        // pedido do usuário; a logo em src/app/assets/image.png é azul mas o
        // destaque da UI não precisa seguir a logo.
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
