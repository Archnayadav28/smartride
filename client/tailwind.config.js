/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          light: '#ffedd5',
          DEFAULT: '#f97316', // Orange
          dark: '#ea580c',
        }
      },
      boxShadow: {
        'diffused': '0 10px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.03)',
        'elevated': '0 20px 50px -20px rgba(28,29,38,0.15), 0 4px 10px rgba(28,29,38,0.05)',
      },
      borderRadius: {
        'xl': '0.8rem',
        '2xl': '1.25rem',
        '3xl': '2rem',
      },
      transitionTimingFunction: {
        'bespoke': 'cubic-bezier(0.23, 1, 0.32, 1)',
      }
    },
  },
  plugins: [],
};
