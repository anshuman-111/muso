/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'btn-primary' : '#FE5F55',
        'btn-secondary' : '#777DA7',
        'btn-important': '#F07167',
        'bg-primary' : '#040F16',
        'bg-secondary' : '#F2F7F2',
        'bg-tertiary' : '#db877f',
        'heading-light': '#F2F7F2',
        'heading-dark' : '#0C0910',
        'emphasis': '#1F1A38'
      },
      fontFamily: {
        'regular' : 'Montserrat, sans-serif',
      }
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio'),],
}