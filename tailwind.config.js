/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F0',
        charcoal: '#2A1F14',
        sage: '#7A9A77',
        'sage-light': '#B8D4B5',
        'sage-dark': '#567A53',
        gold: '#C49A6C',
        'gold-light': '#E8D5B7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glass: '0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        'glass-hover': '0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)',
      },
      animation: {
        blob: 'blob 12s infinite ease-in-out',
        'blob-delay': 'blob 12s infinite ease-in-out 4s',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.08)' },
          '66%': { transform: 'translate(-25px, 20px) scale(0.96)' },
        },
      },
    },
  },
  plugins: [],
}
