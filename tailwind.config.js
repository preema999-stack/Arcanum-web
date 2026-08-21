/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/productDetailsData.ts',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2384ba',
          'blue-hover': '#1b6ca1',
          'blue-light': '#eef7fc',
          dark: '#0f172a',
          light: '#f8fafc',
          card: '#ffffff',
          'dark-card': '#1e293b',
          muted: '#64748b',
          border: '#e2e8f0',
          'dark-border': '#334155',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        widest: '0.15em',
        ultra: '0.25em',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        editorial: '0 20px 40px -15px rgba(15, 23, 42, 0.07)',
        glow: '0 0 25px -5px rgba(35, 132, 186, 0.25)',
      },
    },
  },
  plugins: [],
};
