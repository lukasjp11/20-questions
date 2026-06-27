module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          bg: '#28201a',
          surface: '#372e25',
          'surface-alt': '#2f271f',
          'surface-active': '#443a32',
          gold: '#e6c168',
          'gold-muted': '#cfa544',
          'gold-deep': '#cda03f',
          text: '#f3ead9',
          'text-secondary': '#ece0cb',
          'text-muted': '#c4b395',
          'text-dim': '#a9956f',
          'text-dimmer': '#8a7a63',
          'text-dimmest': '#7d6c52',
          'text-faint': '#6c5d47',
          special: '#e59b73',
          'special-deep': '#d98c5f',
        },
      },
      fontFamily: {
        heading: ['"Fredoka"', '"Nunito"', 'sans-serif'],
        body: ['"Nunito"', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        board: '14px',
        'board-lg': '20px',
        'board-xl': '28px',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #e6c168, #cda03f)',
        'gold-gradient-soft': 'linear-gradient(135deg, #e6c168, #cfa544)',
      },
      boxShadow: {
        'gold': '0 16px 32px -12px rgba(207,165,68,0.5)',
        'gold-sm': '0 8px 18px -6px rgba(207,165,68,0.5)',
        'terra': '0 8px 18px -6px rgba(217,140,95,0.5)',
      },
    },
  },
  plugins: [],
}
