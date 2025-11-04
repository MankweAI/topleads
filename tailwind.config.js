/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use Geist as the primary sans font, modeled after Effluentic
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        // Adopted the professional Effluentic color palette
        "brand-navy": {
          DEFAULT: "#0A2540",
          light: "#1E3A5F",
          dark: "#061A2E",
        },
        "brand-light-gray": "#F6F9FC",
        "brand-action-green": {
          DEFAULT: "#19D479",
          light: "#6EFFB2",
          dark: "#0D9B58",
        },
        "brand-steel": {
          DEFAULT: "#6B7C93",
          light: "#A0AEC0",
          dark: "#4A5568",
        },
        "brand-off-white": "#FFFFFF",
        "brand-info": "#3B82F6",
        "brand-success": "#10B981",
        "brand-warning": "#F59E0B",
        "brand-danger": "#EF4444", // Added a danger color
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
