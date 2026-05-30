/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#071321',
        muted: '#4d5b69',
        soft: '#708091',
        line: '#d7dde3',
        'line-strong': '#bdc9d4',
        paper: '#fbfbf8',
        wash: '#eef3f7',
        steel: '#e8ecef',
        brand: {
          DEFAULT: '#285f96',
          strong: '#174c82',
          soft: '#e3edf6',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: { site: '1180px' },
    },
  },
  plugins: [],
}
