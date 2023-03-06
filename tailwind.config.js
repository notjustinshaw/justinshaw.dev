const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "bg-gray-100",
    "bg-brown-100",
    "bg-orange-100",
    "bg-yellow-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-red-100",
  ],
  theme: {
    colors: {
      gray: colors.zinc,
      brown: colors.stone,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      purple: colors.violet,
      pink: colors.pink,
      red: colors.red,
    },
    extend: {
      fontFamily: {
        sans: ["Wotfard", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss/colors")],
};
