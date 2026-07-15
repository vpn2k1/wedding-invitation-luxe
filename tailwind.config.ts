import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        porcelain: '#ffffff',
        ivory: '#fffafb',
        cream: '#fff1f4',
        champagne: '#ffd1da',
        dune: '#e76a7f',
        clay: '#d41434',
        wine: '#b30f2d',
        plum: '#111111',
        moss: '#f8a8b8',
        ink: '#111111'
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'Times New Roman', 'serif'],
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Avenir Next', 'Segoe UI', 'Arial', 'sans-serif']
      },
      boxShadow: {
        glow: '0 30px 100px rgba(177, 15, 46, 0.18)',
        card: '0 24px 80px rgba(17, 17, 17, 0.12)',
        soft: '0 18px 50px rgba(177, 15, 46, 0.10)'
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
