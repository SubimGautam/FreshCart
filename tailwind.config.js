/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Sage — primary brand color (produce-inspired, replaces old bright green)
        primary: {
          50: '#F4F6F1',
          100: '#E5EADD',
          200: '#C9D3B9',
          300: '#A9B891',
          400: '#859C6C',
          500: '#66804C',
          600: '#526A3C',
          700: '#40532F',
          800: '#313F24',
          900: '#24301B',
        },
        // Muted brick — sale price / secondary accent (deliberately muted, not bright terracotta)
        deal: {
          50: '#FBF1EC',
          100: '#F3DBCC',
          200: '#E5BCA1',
          300: '#D69B76',
          400: '#C97B52',
          500: '#B25E38',
          600: '#96492A',
          700: '#7A3A21',
        },
        // Wheat / ochre — ratings, badges
        flash: {
          300: '#EBD9A1',
          400: '#DCC077',
          500: '#C9A44C',
          600: '#AD8836',
        },
        stone: {
          100: '#EFEBE1',
          200: '#E3DFD3',
          300: '#D3CDBD',
        },
        ink: '#23271F',
        cream: '#F6F4EE',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1rem',
      },
      boxShadow: {
        pop: '0 1px 2px rgba(35,39,31,0.05), 0 8px 20px -6px rgba(35,39,31,0.10)',
        card: '0 1px 2px rgba(35,39,31,0.04), 0 6px 18px -6px rgba(35,39,31,0.08)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pop: 'pop 0.3s ease-out',
        fadeUp: 'fadeUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
