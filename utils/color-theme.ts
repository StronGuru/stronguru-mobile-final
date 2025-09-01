import { vars } from "nativewind";

export const themes = {
  light: vars({
    // Core colors - Light Mode con tonalità sofisticate
    "--color-background": "#fefffe", // off-white invece di bianco puro
    "--color-foreground": "#0a0f14", // nero più morbido
    "--color-card": "#f8faf9", // carta con leggero sottotono verde
    "--color-card-foreground": "#0a0f14",
    "--color-popover": "#ffffff",
    "--color-popover-foreground": "#0a0f14",

    // Primary / accents - Verdi più vivaci e moderni
    "--color-primary": "#10b981", // verde emerald più brillante
    "--color-primary-foreground": "#ffffff",
    "--color-secondary": "#d1fae5", // verde chiaro più delicato
    "--color-secondary-foreground": "#064e3b",
    "--color-accent": "#059669", // verde accent più saturo
    "--color-accent-foreground": "#ffffff",

    // Text / muted - Tonalità più raffinate
    "--color-muted": "#f0fdf4", // verde molto chiaro per aree muted
    "--color-muted-foreground": "#6b7280",

    // Surface - Nuove tonalità di supporto
    "--color-surface": "#f9fafb", // superficie neutra
    "--color-surface-secondary": "#ecfdf5", // superficie con hint di verde
    "--color-surface-tertiary": "#f0fdf4", // superficie più sottile

    // Actions / misc
    "--color-destructive": "#ef4444",
    "--color-destructive-foreground": "#ffffff",
    "--color-border": "#e5e7eb", // bordi più neutri
    "--color-input": "#f9fafb", // input con sfondo più pulito
    "--color-ring": "#10b981", // ring matching primary

    // Chart colors - Palette verde armoniosa
    "--color-chart-1": "#dcfce7",
    "--color-chart-2": "#bbf7d0",
    "--color-chart-3": "#86efac",
    "--color-chart-4": "#4ade80",
    "--color-chart-5": "#22c55e"
  }),

  dark: vars({
    // Core dark - Sfondo moderno slate con sottotoni caldi
    "--color-background": "#0f172a", // slate-900 più moderno
    "--color-foreground": "#f1f5f9", // testo chiaro e pulito
    "--color-card": "#1e293b", // slate-800 per le carte
    "--color-card-foreground": "#f1f5f9",
    "--color-popover": "#1e293b",
    "--color-popover-foreground": "#f1f5f9",

    // Primary / accents - Verdi brillanti per dark mode
    "--color-primary": "#34d399", // verde emerald brillante
    "--color-primary-foreground": "#0f172a",
    "--color-secondary": "#064e3b", // verde scuro per secondary
    "--color-secondary-foreground": "#a7f3d0",
    "--color-accent": "#10b981", // verde accent vivace
    "--color-accent-foreground": "#ffffff",

    // Text / muted - Contrasti ottimizzati
    "--color-muted": "#334155", // slate-700 per aree muted
    "--color-muted-foreground": "#94a3b8", // slate-400 per testo secondario

    // Surface - Tonalità di supporto per dark
    "--color-surface": "#1e293b", // superficie principale
    "--color-surface-secondary": "#334155", // superficie intermedia
    "--color-surface-tertiary": "#475569", // superficie più chiara

    // Actions / misc
    "--color-destructive": "#f87171", // rosso più morbido per dark
    "--color-destructive-foreground": "#ffffff",
    "--color-border": "#334155", // bordi slate per dark
    "--color-input": "#334155", // input con contrasto appropriato
    "--color-ring": "#34d399", // ring brillante

    // Chart colors - Verdi saturi per risaltare su dark
    "--color-chart-1": "#6ee7b7",
    "--color-chart-2": "#34d399",
    "--color-chart-3": "#10b981",
    "--color-chart-4": "#059669",
    "--color-chart-5": "#047857"
  })
};
