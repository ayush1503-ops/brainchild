import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          dark: "#0F0F11", // deep charcoal / warm near-black
          light: "#F4F4F5", // soft white
          accent: "#FF3366", // primary studio-specific accent
          secondary: "#00E5FF", // contrasting game-world accent
          muted: "#8A8A93", // desaturated neutral
          highlight: "#E2FE47", // high-energy highlight used sparingly
        },
      },
      fontFamily: {
        display: ['var(--font-oswald)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
