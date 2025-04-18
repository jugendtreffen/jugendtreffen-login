/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-100': '#E0F2F1',
        'primary-300': '#A7E3DE',
        'primary-500': '#5DBDB8',
        'primary-700': '#3C928E',
        'primary-800': '#34495E',
        'primary-900': '#22313F',
        'accent': '#FF7043',
        'accent-dark': '#c35b3a',
        'secondary': '#2C3E50',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Merriweather', 'sans-serif'],
        monospace: ['monospace'],
      },
    },
  },
  plugins: [],
}

