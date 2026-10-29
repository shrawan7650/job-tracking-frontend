/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#17202e',
        muted: '#8993a3',
        canvas: '#f8f9fc',
        brand: '#4569ed'
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif']
      },
      boxShadow: {
        soft: '0 8px 18px rgba(73, 109, 241, .16)'
      }
    }
  },
  plugins: []
};
