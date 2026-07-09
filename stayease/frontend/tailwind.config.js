/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Premium modern palette per design brief
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563EB", // core brand color
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0F172A", // deep navy
        },
        accent: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#F59E0B", // amber accent
          600: "#d97706",
          700: "#b45309",
        },
        surface: {
          50: "#F8FAFC",
          100: "#f1f5f9",
          200: "#e2e8f0",
          800: "#1e293b",
          900: "#0F172A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(15, 23, 42, 0.12)",
        card: "0 2px 14px -4px rgba(15, 23, 42, 0.10)",
        lift: "0 20px 40px -12px rgba(37, 99, 235, 0.25)",
        glow: "0 0 0 4px rgba(37, 99, 235, 0.12)",
      },
      backgroundImage: {
        "app-backdrop":
          "radial-gradient(circle at 15% 10%, rgba(37,99,235,0.08), transparent 40%), radial-gradient(circle at 85% 0%, rgba(245,158,11,0.06), transparent 45%), radial-gradient(circle at 50% 100%, rgba(15,23,42,0.05), transparent 50%)",
        "hero-overlay":
          "linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.75) 60%, rgba(15,23,42,0.92) 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-468px 0" },
          "100%": { backgroundPosition: "468px 0" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
