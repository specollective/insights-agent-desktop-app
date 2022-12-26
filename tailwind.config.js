/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    colors: {
      ...require('tailwindcss/colors'),
      desktopBgBlack: '#313131',
    },
    extend: {},
  },
  plugins: [],
}
