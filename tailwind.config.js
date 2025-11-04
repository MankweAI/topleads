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
        // Update the sans font family to use the new variable
        sans: ["var(--font-source-sans)", "sans-serif"],
      },
      colors: {
        // Your existing color definitions...
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
      },
      // Keep other extensions if you have them
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
