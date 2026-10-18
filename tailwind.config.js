/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#2997FF",
        gray: {
          DEFAULT: "#86868b",
          100: "#94928d",
          200: "#afafaf",
          300: "#42424570",
        },
        zinc: "#101010",
        dusk: "#0b0710",
        ember: "#ff6f43",
        amber: "#ffb35c",
        ivory: "#f5ecdf",
        sand: "#b7a493",
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Satoshi', 'Inter', 'sans-serif'],
        display: ['Syne', 'Satoshi', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
