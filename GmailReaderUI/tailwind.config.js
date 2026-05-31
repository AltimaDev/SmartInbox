/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#2563EB',
          'light': '#F5F7F9',
          'border': '#E5E7EB',
          'text': '#111827',
          'text-secondary': '#6B7280',
        }
      },
      spacing: {
        '0.5': '0.125rem',
      },
    },
  },
  plugins: [],
}
