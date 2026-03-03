/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        primaryDark: '#3730a3',
        backgroundDark: '#020617',
        backgroundLight: '#f9fafb',
      },
    },
  },
  plugins: [],
};

