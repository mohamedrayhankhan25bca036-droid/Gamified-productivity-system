/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          bg: "#0c0a1a",
          darker: "#080614",
          card: "#181432",
          cardHover: "#201a42",
          cardBorder: "#2a2254",
          purple: {
            light: "#c084fc",
            DEFAULT: "#8b5cf6",
            dark: "#6d28d9",
            glow: "#a855f7",
          },
          accent: "#9333ea",
          gold: "#fbbf24",
          flame: "#f97316",
          emerald: "#10b981",
        }
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.45)',
        'neon-purple-sm': '0 0 10px rgba(139, 92, 246, 0.35)',
        'neon-purple-lg': '0 0 30px rgba(168, 85, 247, 0.55)',
        'neon-gold': '0 0 15px rgba(251, 191, 36, 0.4)',
        'neon-flame': '0 0 15px rgba(249, 115, 22, 0.45)',
        'neon-green': '0 0 15px rgba(16, 185, 129, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
