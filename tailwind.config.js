/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#F0B90B',
          darkBg: '#080d1a',
          cardBg: '#111726'
        }
      }
    },
  },
  plugins: [],
}
