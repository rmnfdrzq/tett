/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F7F5E5",
        foreground: "#11100c",
        parchment: "#F7F5E5",
        paper: "#F7F5E5",
        ink: "#11100c",
        navy: "#29365f",
        "navy-light": "#485378",
        "navy-muted": "#6f789d",
        teal: "#6fa89d",
        "teal-dark": "#2f7b70",
        terracotta: "#bf704b",
        mustard: "#d7a83e",
        cream: "#fff8e9",
        "header-bar": "#e7dec4",
        "paper-muted": "#e7dec4",
        sage: "#e2e9dd",
        scrollbar: "#3d6a9e",
        tab: "#e7dbc3",
        "paper-hover": "#ebdcb9",
        "paper-highlight": "#ede4cc",
        "cart-wheel": "#f6ecd2",
        "tile-preview": "#f8efd8",
        white: "#ffffff",
        "paypal-blue": "#00457C",
        "paypal-blue-light": "#0079C1",
        "visa-blue": "#1A1F71",
        "mastercard-red": "#EB001B",
        "mastercard-orange": "#F79E1B",
        muted: "#9ca3af",
      },
      fontFamily: {
        sans: ['"Nunito"', '"Cabin"', "Arial", "sans-serif"],
        hand: ['"Nunito"', '"Cabin"', "Arial", "sans-serif"],
        display: ['"Amatic SC"', '"Cabin"', "sans-serif"],
        body: ['"Cabin"', "Arial", "sans-serif"],
      },
      boxShadow: {
        ink: "2px 2px 0 var(--color-ink)",
      },
    },
  },
};

export default config;
