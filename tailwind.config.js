/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4643A',
          dark:    '#B3512E',
          light:   '#F5E6DF',
          glow:    'rgba(212,100,58,0.18)',
        },
        warm: {
          50:  '#FDFAF7',
          100: '#FFF0E6',
          200: '#FFDEC8',
          300: '#FFCBA8',
        },
        cream: {
          DEFAULT: '#FDF6EE',
          dark:    '#F5EBE0',
        },
        gold: {
          DEFAULT: '#C9963A',
          light:   '#F5E6C3',
        },
        ink: {
          DEFAULT: '#2A2A2A',
          mid:     '#6B6B6B',
          light:   '#ABABAB',
          faint:   '#D5D5D5',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'sans-serif'],
      },
      scale: {
        '98': '0.98',
        '97': '0.97',
      },
      boxShadow: {
        'book':   '0 8px 40px rgba(180, 100, 40, 0.18), 0 2px 8px rgba(180,100,40,0.10)',
        'card':   '0 2px 16px rgba(42,42,42,0.07)',
        'cta':    '0 8px 32px rgba(212,100,58,0.30)',
        'glow':   '0 0 0 4px rgba(212,100,58,0.15)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(160deg, #FFF5EC 0%, #FDFAF7 55%, #FFF0E6 100%)',
        'book-gradient': 'linear-gradient(135deg, #D4643A 0%, #C9963A 100%)',
        'page-stripe':   'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(212,100,58,0.06) 28px, rgba(212,100,58,0.06) 29px)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
