import flowbiteReact from "flowbite-react/plugin/tailwindcss";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.flowbite-react/class-list.json", // ✅
  ],
  theme: {
    extend: {
      colors: {
        blueMain: "#3B85C1",
        blueDark: "#16294F",
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [flowbiteReact],
};
