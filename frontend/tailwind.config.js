/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eafbf1',
          100: '#cdf5dd',
          200: '#9eebc0',
          300: '#65da9d',
          400: '#34c47e',
          500: '#10a863',
          600: '#0e9f4f',
          700: '#0b7d40',
          800: '#0a6135',
          900: '#08502d',
        },
        deal: {
          50: '#ffe9f0',
          100: '#ffccdd',
          400: '#ff6b9d',
          500: '#ff3d71',
          600: '#e91e63',
          700: '#c2185b',
        },
        flash: {
          300: '#ffe066',
          400: '#ffd23f',
          500: '#ffc700',
          600: '#e6b300',
        },
        ink: '#1a1a2e',
        cream: '#fff8f0',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        pop: '0 4px 0 0 rgba(0,0,0,0.08)',
        card: '0 2px 12px rgba(26,26,46,0.08)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pop: {
          '0%': { transform: 'scale(0.95)' },
          '60%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        marquee: 'marquee 18s linear infinite',
        pop: 'pop 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
