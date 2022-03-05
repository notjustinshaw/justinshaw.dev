const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Wotfard", ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}
