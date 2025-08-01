/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF', // White
        primary: '#FFFDE7',   // Very light yellow
        text: '#1F2937',      // Dark gray
        accent: '#FBBF24',     // Stronger yellow for highlights
        'accent-dark': '#F59E0B', // Darker accent for hover states
      },
    },
  },
  plugins: [],
}
