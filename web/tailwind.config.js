/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-10': '#B8E2DE',
        'primary-50': '#29B3B3',
        'primary-90': '#00515A',
        'accent': '#FF5A3D',
        'secondary': '#162D4E',
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

