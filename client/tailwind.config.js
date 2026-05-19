/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00f2ff",
        secondary: "#7000ff",
        dark: "#0a0a0a",
        card: "#121212",
        danger: "#ff003c",
        warning: "#ff9d00",
        success: "#00ff88",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
