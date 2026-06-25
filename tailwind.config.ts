import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold:  { DEFAULT: '#C9A84C', light: '#E2C97E', dark: '#9A7A2E' },
        ink:   '#080808',
        cream: '#F5EFE0',
        stone: '#1C1A17',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        stat:    ['Bodoni Moda', 'Georgia', 'serif'],
        body:    ['Jost', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)', filter: 'blur(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)',    filter: 'blur(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% center' },
          to:   { backgroundPosition: '200% center' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          from: { transform: 'translateX(-50%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.32,0.72,0,1) both',
        shimmer:   'shimmer 4s linear infinite',
        marquee:   'marquee 28s linear infinite',
        'marquee-reverse': 'marquee-reverse 28s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
