const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C3B5FF",
        "primary-dark": "#13012A",
        gray: "#F3F2F2",
        secondary: "#B4AEF9",
        neutral: {
          150: "#f3f3f3",
          250: "#D6D6D6",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
