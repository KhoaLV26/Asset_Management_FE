/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'd6001c': '#d6001c',
      },
      backgroundColor: {
        'overlay-70' : 'rgba(0,0,0,0.7)'
      },
    },
  },
  plugins: [],
}

