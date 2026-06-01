/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf7f0',
          100: '#faeadb',
          200: '#f3cfaa',
          300: '#e8ac72',
          400: '#d9843e',
          500: '#c46b24',
          600: '#a3561d',
          700: '#83431a',
          800: '#6b3518',  // rich warm brown — nav / primary
          900: '#4e2712',
        },
        gold: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',  // vibrant amber/gold accent
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
