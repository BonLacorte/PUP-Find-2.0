/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    

    fontSize: {
        'sm': '12px',
        'base': '14px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '38px',
        '5xl': '50px',
        '6xl': '64px',
        '7xl': '80px',
        '8xl': '96px',
        '9xl': '128px',
    },

    extend: {

      colors: {
        // 'white': '#FFFFFF',
        // 'black': '#242424',
        // 'grey': '#F3F3F3',
        // 'dark-grey': '#6B6B6B',
        // 'red': '#FF4E4E',
        // 'transparent': 'transparent',
        // 'twitter': '#1DA1F2',
        // 'purple': '#8B46FF',
        grey: '#F3F3F3',
        'dark-grey': '#6B6B6B',
        white: '#FFFFFF',
        black: '#242424',
        customBackground: "#f4f6f9",
        primaryColor: "#800000",
        secondaryColor: "#FFDF00",
      },

      fontFamily: {
        inter: ["'Inter'", "sans-serif"],
        gelasio: ["'Gelasio'", "serif"]
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(31 29 29) white"
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "white"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgb(31 41 55)",
            borderRadius: "20px",
            border: "1px solid white"
          }
        }
      }

      addUtilities(newUtilities, ["responsive", "hover"])
    }
  ],
}

