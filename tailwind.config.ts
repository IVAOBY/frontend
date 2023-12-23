import type { Config } from 'tailwindcss'

export default {
  content: [
    'src/**/*.{ts,tsx}'
  ],
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        ivao: {
          blue: "#0D2C99",
          grey: "#D7D7DC",
          lightBlue: "#3C55AC",
          green: "#2EC662",
          yellow: "#F9CC2C",
          red: "#E93434",
          infoBlue: "#7EA2D6"
        }
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
} satisfies Config

