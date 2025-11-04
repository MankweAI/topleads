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
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        // ALL FLAT KEY/VALUE PAIRS - DO NOT NEST!
        "brand-navy": "#0A2540",
        "brand-navy-light": "#1E3A5F",
        "brand-navy-dark": "#061A2E",
        "brand-light-gray": "#F6F9FC",
        "brand-off-white": "#FFFFFF",
        "brand-action-green": "#19D479",
        "brand-action-green-light": "#6EFFB2",
        "brand-action-green-dark": "#0D9B58",
        "brand-steel": "#6B7C93",
        "brand-steel-light": "#A0AEC0",
        "brand-steel-dark": "#4A5568",
        "brand-info": "#3B82F6",
        "brand-success": "#10B981",
        "brand-warning": "#F59E0B",
        primary: "#2D3436",
        secondary: "#27AE60",
        accent: "#E67E22",
        background: "#FDFEFE",
        "text-dark": "#2C3E50",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
