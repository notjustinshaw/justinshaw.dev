const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
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
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss/colors'),
  ],
}
