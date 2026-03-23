/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0A1628',
          900: '#0F2044',
          800: '#152035',
          700: '#1E2F4D',
        },
        gold: {
          300: '#F0D898',
          400: '#E8C87A',
          500: '#C9A84C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #C9A84C, #E8C87A)',
      },
      boxShadow: {
        'gold-glow': '0 0 30px rgba(201,168,76,0.3)',
        'gold-sm': '0 0 15px rgba(201,168,76,0.2)',
        'navy-lg': '0 10px 40px rgba(10,22,40,0.8)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'count-up': 'count-up 2s ease-out forwards',
      },
      keyframes: {
        'pulse-gold': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(201,168,76,0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
