/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
          gray: {
            DEFAULT: "#333333",
            dark: "#333333",
            medium:"#DDDDDD",
            light: "#EEEEEE"
          },
          green: {
            DEFAULT: "#aaf8b0"
          },
          red: {
            DEFAULT: "#E06868"
          },
          rose: {
            DEFAULT: "#EEC7F4"
          },
        }
    },
  },
  plugins: [],
}

