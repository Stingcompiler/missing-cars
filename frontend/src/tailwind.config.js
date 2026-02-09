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
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9', // Sky blue - trustworthy & calm
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          500: '#64748b', // Slate - professional
        },
        danger: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'sans-serif'], // Add an Arabic font like Tajawal in index.html
      }
    },
  },
  plugins: [],
}