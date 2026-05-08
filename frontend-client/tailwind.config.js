/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fcd34d',
          50: '#fffbeb',
          100: '#fef3c7',
        },
        secondary: {
          DEFAULT: '#14b8a6',
          dark: '#0d9488',
          light: '#5eead4',
        },
        accent: {
          DEFAULT: '#f97316',
          light: '#fb923c',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'heart-pulse': 'heartPulse 1s ease infinite',
        'spin-slow': 'spin 0.8s linear infinite',
      },
    },
  },
  plugins: [],
}
