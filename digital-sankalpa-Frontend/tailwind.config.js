/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'ds-blue': '#0091ea',
          'ds-gray': '#f8f9fa',
        },
      },
    },
    plugins: [],
  }