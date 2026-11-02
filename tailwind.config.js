/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Hanken Grotesk', 'sans-serif'], display: ['Fraunces', 'serif'], mono: ['JetBrains Mono', 'monospace'] },
      borderRadius: { DEFAULT: 'var(--radius-control)', sm: 'var(--radius-control)', md: 'var(--radius-control)', lg: 'var(--radius-control)', xl: 'var(--radius-card)', '2xl': 'var(--radius-card)', '3xl': 'var(--radius-card)', full: '9999px' },
      boxShadow: { sm: 'var(--shadow-card)', md: 'var(--shadow-card)', lg: 'var(--shadow-card)', xl: 'var(--shadow-modal)', '2xl': 'var(--shadow-modal)' },
    },
  },
  plugins: [],
}
