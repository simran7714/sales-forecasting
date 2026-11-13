/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e8f2',
          200: '#c3d1e6',
          300: '#94b0d4',
          400: '#5e89be',
          500: '#396ba8',
          600: '#2a538d',
          700: '#234373',
          800: '#1b345b',
          900: '#0f1f38',
          950: '#091323',
        },
        brand: {
          purple: '#7c3aed',
          accent: '#6366f1',
          light: '#f5f3ff',
          dark: '#4c1d95',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
