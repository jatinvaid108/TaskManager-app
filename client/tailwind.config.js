/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1", // Indigo (for buttons, highlights)
        accent: "#14B8A6",  // Teal (secondary)
        dark: "#0F172A",    // Navy background for headers

        // ---------- Dark redesign theme ----------
        night: { DEFAULT: "#07070D", light: "#0B0B14" },                      // page / sidebar background
        surface: { DEFAULT: "#0F0F19", raised: "#151522", hover: "#1A1A2A" }, // cards / inputs / hover
        line: { DEFAULT: "#1F1F2E", strong: "#2A2A3D" },                      // borders
        brand: { DEFAULT: "#7C3AED", light: "#A78BFA", dark: "#6D28D9" },     // violet accent
        ink: { DEFAULT: "#F4F4F8", muted: "#A1A1B5", subtle: "#6B6B80" },     // text
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(124, 58, 237, 0.55)",
        "glow-sm": "0 0 20px -6px rgba(124, 58, 237, 0.45)",
      },
      backgroundImage: {
        "glow-radial":
          "radial-gradient(60% 50% at 50% 0%, rgba(124, 58, 237, 0.22) 0%, rgba(7, 7, 13, 0) 70%)",
        "brand-gradient": "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
        "card-glow":
          "radial-gradient(120% 80% at 0% 0%, rgba(124, 58, 237, 0.14) 0%, rgba(124, 58, 237, 0) 60%)",
      },
    },
  },
  plugins: [],
}
