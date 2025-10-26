/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff4f2',
          100: '#ffe8e3',
          200: '#ffd1c7',
          300: '#ffb3a1',
          400: '#ff8a6b',
          500: '#FF4C24', // Main brand color
          600: '#e5533c',
          700: '#cc4a34',
          800: '#b3412c',
          900: '#9a3824',
        },
        secondary: {
          50: '#f8f9fa',
          100: '#f1f3f4',
          200: '#e8eaed',
          300: '#dadce0',
          400: '#bdc1c6',
          500: '#49557E', // Main secondary color
          600: '#3d4a6b',
          700: '#313f58',
          800: '#253445',
          900: '#192932',
        },
        accent: {
          50: '#fff4f2',
          100: '#ffe8e3',
          200: '#ffd1c7',
          300: '#ffb3a1',
          400: '#ff8a6b',
          500: '#ff6347', // Tomato accent
          600: '#e5533c',
          700: '#cc4a34',
          800: '#b3412c',
          900: '#9a3824',
        },
        gray: {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e8e8e8',
          300: '#d1d1d1',
          400: '#b0b0b0',
          500: '#888888',
          600: '#6d6d6d',
          700: '#525252',
          800: '#333333', // Main text color
          900: '#1a1a1a',
        }
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 15px rgba(0, 0, 0, 0.1)',
        'strong': '0 4px 15px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
