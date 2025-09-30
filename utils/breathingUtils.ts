export interface BreathingConfig {
  id?: number; // id univoco opzionale
  inhale: number; // durata in secondi dell’inspirazione
  holdIn: number; // durata in secondi della pausa a polmoni pieni
  exhale: number; // durata in secondi dell’espirazione
  holdOut: number; // durata in secondi della pausa a polmoni vuoti
  duration?: number; // durata totale in minuti (opzionale)
  label?: string; // nome del preset
  description?: string; // descrizione
}

export const breathingPresets: BreathingConfig[] = [
  {
    id: 1,
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    duration: 2, // minuti
    label: "Box Breathing",
    description:
      "Tecnica usata anche da atleti e militari per ristabilire calma e concentrazione. Equilibra inspirazione, trattenuta ed espirazione riducendo stress e ansia."
  },
  {
    id: 2,
    inhale: 4,
    holdIn: 6,
    exhale: 4,
    holdOut: 6,
    duration: 3,
    label: "Relax Breathing",
    description: "Favorisce il rilassamento grazie a trattenute più lunghe. Rallenta il ritmo cardiaco e aiuta a sciogliere tensione fisica e mentale."
  },
  {
    id: 3,
    inhale: 5,
    holdIn: 5,
    exhale: 5,
    holdOut: 5,
    duration: 2,
    label: "Equal Breaths",
    description: "Mantiene un ritmo costante e bilanciato. Utile per stabilizzare il respiro, migliorare la consapevolezza e ritrovare equilibrio interiore."
  },
  {
    id: 4,
    inhale: 3,
    holdIn: 6,
    exhale: 3,
    holdOut: 6,
    duration: 3,
    label: "2:1 Ratio",
    description:
      "Enfatizza il rilascio con espirazioni e pause più lunghe. Aiuta a scaricare la tensione accumulata, utile per ridurre stress e favorire il sonno."
  },
  {
    id: 5,
    inhale: 4,
    holdIn: 0,
    exhale: 6,
    holdOut: 0,
    duration: 3,
    label: "Calm Breathing",
    description: "L’espirazione prolungata stimola il sistema parasimpatico, favorendo rilassamento profondo e facilitando l’addormentamento."
  },
  {
    id: 6,
    inhale: 6,
    holdIn: 2,
    exhale: 6,
    holdOut: 2,
    duration: 3,
    label: "Recovery Breathing",
    description: "Indicato dopo sforzi fisici. Ristabilisce ossigenazione e favorisce il recupero grazie a un ritmo lento e regolare."
  },
  {
    id: 7,
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    duration: 4,
    label: "Anti-Stress Breathing",
    description:
      "Un pattern profondo che scioglie tensione nervosa. Allunga espirazione e trattenuta per calmare mente e corpo nelle situazioni di forte stress."
  }
];

export const parsePatternString = (pattern: string) => {
  const parts = pattern.split("-").map((v) => Number(v) || 0);
  const [inhale = 0, holdIn = 0, exhale = 0, holdOut = 0] = parts;
  return { inhale, holdIn, exhale, holdOut };
};

// validate/normalize minutes input (returns integer minutes or undefined)
export const normalizeMinutes = (minutes?: number | string): number | undefined => {
  if (minutes === undefined || minutes === null || minutes === "") return undefined;
  const m = Number(minutes);
  if (!Number.isFinite(m) || m <= 0) return undefined;
  return Math.round(m);
};

export const buildConfigFromPreset = (label: string, pattern: string, durationMinutes?: number | string, description?: string): BreathingConfig => {
  const p = parsePatternString(pattern);
  return {
    inhale: p.inhale,
    holdIn: p.holdIn,
    exhale: p.exhale,
    holdOut: p.holdOut,
    duration: normalizeMinutes(durationMinutes), // minutes now
    label,
    description
  };
};

export const buildConfigFromCustom = (
  inhaleStr: string,
  holdInStr: string,
  exhaleStr: string,
  holdOutStr: string,
  durationMinutes?: number | string,
  label = "Custom"
): BreathingConfig => {
  const inhale = Number(inhaleStr) || 0;
  const holdIn = Number(holdInStr) || 0;
  const exhale = Number(exhaleStr) || 0;
  const holdOut = Number(holdOutStr) || 0;
  return {
    inhale,
    holdIn,
    exhale,
    holdOut,
    duration: normalizeMinutes(durationMinutes), // minutes now
    label
  };
};
