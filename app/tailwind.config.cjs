/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        'overview': '480px auto'
      },
      gridTemplateRows: {
        'overview': 'min-content min-content'
      }
    },
  },
  plugins: [],
};
