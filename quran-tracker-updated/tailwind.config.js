/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep background
        bg: {
          base: '#080f12',
          surface: '#0d1a1f',
          card: '#111f25',
          elevated: '#162830',
          border: '#1e3a42',
        },
        // Primary emerald
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Gold accent
        gold: {
          light: '#f0d060',
          DEFAULT: '#d4af37',
          dark: '#b8941e',
        },
        // Text
        text: {
          primary: '#e5e7eb',
          secondary: '#9ca3af',
          muted: '#6b7280',
          accent: '#34d399',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cinzel)', 'Georgia', 'serif'],
        arabic: ['var(--font-amiri)', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'geometric': "url('/geometric-pattern.svg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(16,185,129,0.2)' },
          '50%': { boxShadow: '0 0 24px rgba(16,185,129,0.5)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'emerald': '0 0 20px rgba(16,185,129,0.15)',
        'emerald-lg': '0 0 40px rgba(16,185,129,0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'gold': '0 0 20px rgba(212,175,55,0.2)',
      },
    },
  },
  plugins: [],
};
