import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        porcelain: '#fffdf8',
        ivory: '#fbf4e9',
        cream: '#f4e7d2',
        champagne: '#ead1a2',
        dune: '#c2a077',
        clay: '#9d6d5d',
        wine: '#6d2f3f',
        plum: '#3f2230',
        moss: '#5f6f5f',
        ink: '#2d2320'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Avenir Next', 'Segoe UI', 'Arial', 'sans-serif']
      },
      boxShadow: {
        glow: '0 30px 100px rgba(109, 47, 63, 0.18)',
        card: '0 24px 80px rgba(45, 35, 32, 0.12)',
        soft: '0 18px 50px rgba(109, 47, 63, 0.10)'
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 3.2s ease-in-out infinite',
        fadeUp: 'fadeUp 0.85s ease both',
        slowSpin: 'slowSpin 22s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        shimmer: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.8' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slowSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
