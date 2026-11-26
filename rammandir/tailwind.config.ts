import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: "rgb(95, 37, 15)",
        rust: "rgb(171, 86, 38)",
        sand: "rgb(247, 232, 212)",
        gold: "rgb(221, 164, 93)",
        whatsapp: "rgb(37, 211, 102)",
      },
      fontFamily: {
        gotham: ["Gotham", "-apple-system", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
