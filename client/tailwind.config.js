/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Instrument Serif', 'serif'],
        sans:  ['DM Sans', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:       '#0A0A0A',
        surface:  '#111111',
        's2':     '#1A1A1A',
        accent:   '#E8D5B7',
        border:   'rgba(255,255,255,0.08)',
      }
    }
  }
}
