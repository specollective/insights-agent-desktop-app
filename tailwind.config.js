/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}',
    // './node_modules/tw-elements/dist/js/**/*.js'
  ],
  plugins: [
    // require('tw-elements/dist/plugin')
  ],
  theme: {
    colors: {
      ...require('tailwindcss/colors'),
      desktopBgBlack: '#313131',
    },
    extend: {},
  },
}
