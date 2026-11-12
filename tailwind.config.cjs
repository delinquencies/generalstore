const forms = require('@tailwindcss/forms');
const containerQueries = require('@tailwindcss/container-queries');

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: { extend: {
          colors: {
            "cream": "#FAF7F2",
            "cream-muted": "#F3ECE0",
            "ink": "#1E1A17",
            "cobalt": "#1D4ED8",
            "electric-blue": "#2563EB",
            "tangerine": "#F9572C",
            "melon": "#FFA280",
            "canary": "#FFDF00",
            "butter": "#FEF08A",
            "sage": "#4D635C",
            "forest": "#132D24",
            "lilac": "#E9D5FF",
            "bubblegum": "#F472B6",
            "brick": "#B93815"
          },
          fontFamily: {
            "serif": ["Newsreader", "serif"],
            "sans": ["DM Sans", "sans-serif"],
            "mono-display": ["Space Grotesk", "monospace"]
          }
        } },
  plugins: [forms, containerQueries],
};
