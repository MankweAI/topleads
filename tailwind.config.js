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
        // --- NEW VIBRANT THEME ---

        // Base & Backgrounds
        "tl-dark": "#0f172a", // slate-900 (For headers/footers)
        "tl-bg": "#f1f5f9", // slate-100 (Main light background)
        "tl-card": "#ffffff", // white (For cards on light bg)

        // Text
        "tl-text": "#0f172a", // slate-900 (Primary text on light bg)
        "tl-steel": "#64748b", // slate-500 (Medium text)
        "tl-steel-light": "#94a3b8", // slate-400 (Light text on dark bg)
        "tl-white": "#ffffff", // white

        // Primary Action (Lime Green)
        "tl-action": "#84cc16", // lime-500
        "tl-action-hover": "#a3e635", // lime-400
        "tl-action-dark": "#4d7c0f", // lime-700

        // Secondary Accent (Indigo)
        "tl-accent": "#4f46e5", // indigo-600
        "tl-accent-hover": "#6366f1", // indigo-500

        // Warning / "Leak" Color (Orange)
        "tl-leak": "#f97316", // orange-500
        "tl-leak-light": "#ffedd5", // orange-100 (for backgrounds)

        // Tertiary Accent (Cyan)
        "tl-info": "#06b6d4", // cyan-500
        "tl-info-light": "#cffafe", // cyan-100 (for backgrounds)
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
