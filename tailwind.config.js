module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          bg: '#2c2520',
          surface: '#3a322b',
          'surface-alt': '#352d27',
          'surface-active': '#443a32',
          gold: '#d4a854',
          'gold-muted': '#b8963e',
          text: '#efe5d4',
          'text-secondary': '#ddd0b8',
          'text-muted': '#b8a890',
          'text-dim': '#9a8c76',
          'text-dimmer': '#8a7c66',
          'text-dimmest': '#7a6c58',
          'text-faint': '#695c4a',
          special: '#c8845a',
        },
      },
      fontFamily: {
        heading: ['"Libre Baskerville"', 'Georgia', 'serif'],
        body: ['"DM Sans"', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        board: '6px',
      },
    },
  },
  plugins: [],
}