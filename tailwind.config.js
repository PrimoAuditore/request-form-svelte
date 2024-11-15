/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111F51',
          light: '#1a2f7a'
        },
        accent: {
          DEFAULT: '#19CEDA',
          light: '#3dd8e2'
        }
      }
    },
  },
  plugins: [],
}