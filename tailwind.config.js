/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        "5xl": "1080px",
        "4xl": "1000px",
        "3xl": "950px",
      },
      colors: {
        primary: "#006CB7",
      },
    },
  },
  plugins: [],
};
