import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Baloo 2'", "'Fredoka One'", 'Montserrat', 'cursive', 'sans-serif'],
        body: ["'Poppins'", "'Nunito'", 'Quicksand', 'sans-serif'],
        accent: ["'Pacifico'", 'cursive'],
        serif: ["'Playfair Display'", "'Cormorant Garamond'", 'serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounceSparkle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px) scale(1.1)' }
        },
        gentleGlow: {
          '0%': { boxShadow: '0 0 5px rgba(247, 200, 208, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(247, 200, 208, 0.4)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        bounceSparkle: 'bounceSparkle 0.8s infinite',
        gentleGlow: 'gentleGlow 2s ease-in-out infinite alternate',
        float: 'float 3s ease-in-out infinite',
      },
      colors: {
        // Minimalist palette (use these hex values only)
        minimalist: {
          sky: "#d9ecff",
          blue: "#b8d6f2",
          sand: "#f7efe3",
          rose: "#e7c7c2",
          slate: "#5b6f7f",
        },
        brand: {
          50: "#f7efe3",
          100: "#d9ecff",
          200: "#b8d6f2",
          300: "#b8d6f2",
          400: "#5b6f7f",
          500: "#5b6f7f",
          600: "#5b6f7f",
          700: "#5b6f7f",
          800: "#5b6f7f",
          900: "#5b6f7f",
        },
        violet: {
          50: "#f7efe3",
          100: "#d9ecff",
          200: "#b8d6f2",
          300: "#b8d6f2",
          400: "#5b6f7f",
          500: "#5b6f7f",
          600: "#5b6f7f",
          700: "#5b6f7f",
          800: "#5b6f7f",
          900: "#5b6f7f",
        },
        peach: {
          50: "#f7efe3",
          100: "#e7c7c2",
          200: "#e7c7c2",
          300: "#e7c7c2",
          400: "#e7c7c2",
          500: "#e7c7c2",
        },
        cream: {
          50: "#f7efe3",
          100: "#f7efe3",
          200: "#f7efe3",
          300: "#f7efe3",
        },
        coquette: {
          cream: "#f7efe3",
          blush: "#e7c7c2",
          lavender: "#b8d6f2",
          gold: "#b8d6f2",
          rose: "#5b6f7f",
          pearl: "#d9ecff",
          softPink: "#d9ecff",
          lavenderLight: "#b8d6f2",
          mint: "#d9ecff",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "kawaii-doodle": "url('/doodles/kawaii-bg.svg')",
      },
      boxShadow: {
        soft: '0 8px 32px 0 rgba(91, 111, 127, 0.12)',
        pastel: '0 4px 24px 0 rgba(184, 214, 242, 0.18)',
        delicate: '0 4px 16px rgba(91, 111, 127, 0.10)',
        glow: '0 0 20px rgba(184, 214, 242, 0.35)',
      },
      zIndex: {
        100: "100",
        "-10": "-10",
      },
    },
  },
};
export default config;
