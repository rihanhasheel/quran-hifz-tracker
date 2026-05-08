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
        bg: {
          base:     '#060a0e',
          surface:  '#0a1018',
          card:     '#0e1620',
          elevated: '#131e2a',
          border:   '#1a2b3a',
        },
        teal: {
          DEFAULT: '#0d9488',
          light:   '#14b8a6',
          dim:     '#0f766e',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light:   '#e2c97e',
          dim:     '#a07830',
        },
        text: {
          primary:   '#e8edf2',
          secondary: '#8fa3b8',
          muted:     '#4d6478',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:    '0 4px 24px rgba(0,0,0,0.3)',
        emerald: '0 4px 16px rgba(13,148,136,0.2)',
      },
    },
  },
  plugins: [],
}
