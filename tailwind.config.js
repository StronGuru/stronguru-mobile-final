/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core colors (use CSS var with hex fallback)
        background: "var(--color-background, #fefffe)",
        foreground: "var(--color-foreground, #0a0f14)",

        // Card
        card: "var(--color-card, #f8faf9)",
        "card-foreground": "var(--color-card-foreground, #0a0f14)",

        // Popover
        popover: "var(--color-popover, #ffffff)",
        "popover-foreground": "var(--color-popover-foreground, #0a0f14)",

        // Primary / secondary / accent
        primary: "var(--color-primary, #10b981)",
        "primary-foreground": "var(--color-primary-foreground, #ffffff)",
        secondary: "var(--color-secondary, #d1fae5)",
        "secondary-foreground": "var(--color-secondary-foreground, #064e3b)",
        accent: "var(--color-accent, #059669)",
        "accent-foreground": "var(--color-accent-foreground, #ffffff)",

        // Muted / support
        muted: "var(--color-muted, #f0fdf4)",
        "muted-foreground": "var(--color-muted-foreground, #6b7280)",
        surface: "var(--color-surface, #f9fafb)",
        "surface-variant": "var(--color-surface-secondary, #ecfdf5)",

        // Misc
        destructive: "var(--color-destructive, #ef4444)",
        "destructive-foreground": "var(--color-destructive-foreground, #ffffff)",
        border: "var(--color-border, #e5e7eb)",
        input: "var(--color-input, #f9fafb)",
        ring: "var(--color-ring, #10b981)",

        // Charts
        "chart-1": "var(--color-chart-1, #dcfce7)",
        "chart-2": "var(--color-chart-2, #bbf7d0)",
        "chart-3": "var(--color-chart-3, #86efac)",
        "chart-4": "var(--color-chart-4, #4ade80)",
        "chart-5": "var(--color-chart-5, #22c55e)"
      },
      borderRadius: {
        lg: "var(--radius, 0.625rem)",
        md: "calc(var(--radius, 0.625rem) - 2px)",
        sm: "calc(var(--radius, 0.625rem) - 4px)"
      }
    }
  },
  plugins: []
};
