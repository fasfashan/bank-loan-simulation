/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      maxWidth: {
        "5xl": "1080px",
      },
      colors: {
        primary: "#006CB7",
      },
    },
  },
  plugins: [],
};
