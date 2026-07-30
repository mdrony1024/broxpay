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
          darkBg: '#0b0f19',
          cardBg: '#161c2a'
        }
      }
    },
  },
  plugins: [],
}
