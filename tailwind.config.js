/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors:{
        'fs-red':'#6A271C',
        'fs-green':'#8E9D82',
        'fs-dark-red': '#402317',
        'fs-brown': '#42372A',
        'fs-gold': '#9C855C',
        'fs-lemon-grass':'#97A18F',
        'fs-bud':'#A9B4A0',
        'fs-ash':'#C0BEAA',
        'fs-tobacco-brown':'#706142',
      }
    },
  },
  plugins: [],
}
