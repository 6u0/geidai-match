module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#e7c378',
      },
      fontFamily: {
        serif: [
          'Yu Mincho',
          'Hiragino Mincho ProN',
          'Noto Serif JP',
          'Times New Roman',
          'serif',
        ],
        sans: ['BIZ UDPGothic', 'Yu Gothic', 'Noto Sans JP', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
