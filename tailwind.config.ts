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
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounceSparkle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px) scale(1.1)' }
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        bounceSparkle: 'bounceSparkle 0.8s infinite',
      },
      colors: {
        brand: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        violet: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        peach: {
          50: "#fff5f0",
          100: "#ffe0d3",
          200: "#ffd1b3",
          300: "#ffb385",
          400: "#ff9966",
          500: "#ff7f50",
        },
        cream: {
          50: "#fffdf7",
          100: "#fff7e6",
          200: "#fff3d9",
          300: "#ffeccc",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "kawaii-doodle": "url('/doodles/kawaii-bg.svg')",
      },
      boxShadow: {
        soft: '0 8px 32px 0 rgba(236, 72, 153, 0.12)',
        pastel: '0 4px 24px 0 rgba(255, 179, 133, 0.10)',
      },
      zIndex: {
        100: "100",
        "-10": "-10",
      },
    },
  },
};
export default config;
