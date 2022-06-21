/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      heading: ['"Uber Move"', "serif"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FFC251",
          50: "#FFF7DB",
          100: "#FFF2CB",
          200: "#FFE9AD",
          300: "#FFDD8E",
          400: "#FFD170",
          500: "#FFC251",
          600: "#FFA20A",
          700: "#C17300",
          800: "#7A4500",
          900: "#321B00",
        },
        secondary: {
          DEFAULT: "#362D1C",
          50: "#FAF8F5",
          100: "#EAE4D7",
          200: "#CBBA9B",
          300: "#AC915E",
          400: "#725F3B",
          500: "#362D1C",
          600: "#2C2517",
          700: "#221C12",
          800: "#18140C",
          900: "#0E0B07",
        },
        tertiary: {
          DEFAULT: "#4A4A4A",
          50: "#F6F6F6",
          100: "#E3E3E3",
          200: "#BDBDBD",
          300: "#979797",
          400: "#707070",
          500: "#4A4A4A",
          600: "#3B3B3B",
          700: "#2B2B2B",
          800: "#1C1C1C",
          900: "#0D0D0D",
        },
      },
    },
  },
  plugins: [],
};
