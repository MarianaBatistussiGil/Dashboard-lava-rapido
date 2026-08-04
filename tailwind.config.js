/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#05070a",
          900: "#0b0e13",
          800: "#12161d",
          700: "#1b212b",
          600: "#2a323f",
        },
      },
    },
  },
  plugins: [],
};
