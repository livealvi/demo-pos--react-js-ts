/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: "jit",
  purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      roboto: "'Roboto', sans-serif;",
      open_sans: "'Open Sans', sans-serif",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
