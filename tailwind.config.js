const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        quicksand: ["Quicksand", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bk: {
          grayLight: "#F8F9FA",
          grayMid: "#C4C4C4",
          grayDark: "#212529",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
