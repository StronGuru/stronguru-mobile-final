export interface BreathingConfig {
  id?: number; // id univoco opzionale
  inhale: number; // durata in secondi dell’inspirazione
  holdIn: number; // durata in secondi della pausa a polmoni pieni
  exhale: number; // durata in secondi dell’espirazione
  holdOut: number; // durata in secondi della pausa a polmoni vuoti
  duration?: number; // durata totale in minuti (opzionale)
  cycles?: number; // numero di cicli (ogni ciclo = inhale + holdIn + exhale + holdOut)
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
    cycles: 8,
    label: "Box Breathing",
    description:
      "Tecnica semplice e potente: inspira, trattieni, espira e trattieni per intervalli uguali. Usata anche da atleti e militari per dominare lo stress, calma il sistema nervoso e favorisce concentrazione. Ottima in momenti di tensione o prima di affrontare compiti impegnativi."
  },
  {
    id: 2,
    inhale: 4,
    holdIn: 6,
    exhale: 4,
    holdOut: 6,
    duration: 3,
    cycles: 9,
    label: "Relax",
    description:
      "Una respirazione rallentata con pause più lunghe, pensata per sciogliere le tensioni. Rallenta il battito, favorisce un rilassamento profondo e aiuta a liberare lo stress accumulato dopo una giornata intensa."
  },
  {
    id: 3,
    inhale: 3,
    holdIn: 6,
    exhale: 3,
    holdOut: 6,
    duration: 3,
    cycles: 10,
    label: "2:1 Ratio",
    description:
      "Questo pattern dà priorità all’espirazione e alle pause: utile per scaricare emozioni, ridurre tensioni e favorire uno stato di calma profonda. Ottimo da usare in momenti in cui senti la mente “overload”."
  },
  {
    id: 4,
    inhale: 4,
    holdIn: 0,
    exhale: 6,
    holdOut: 0,
    duration: 3,
    cycles: 18,
    label: "Calm",
    description:
      "Respirazione semplice con espirazione estesa, senza pause. Stimola la risposta parasimpatica del corpo, favorisce rilassamento profondo e può essere utile per addormentarsi o calmarsi durante momenti di agitazione."
  },
  {
    id: 5,
    inhale: 6,
    holdIn: 2,
    exhale: 6,
    holdOut: 2,
    duration: 3,
    cycles: 11,
    label: "Post-Workout",
    description:
      "Ideale dopo lo sforzo fisico, questo pattern favorisce un recupero più rapido, ossigena i muscoli e rallenta il battito in modo dolce. Ottimo subito dopo l’allenamento o una sessione intensa."
  },
  {
    id: 6,
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    duration: 4,
    cycles: 13,
    label: "Deep Calm",
    description:
      "Una respirazione profonda e rallentata pensata per liberare la mente dallo stress accumulato. Perfetta in momenti di forte tensione, prima di dormire o per recuperare lucidità dopo una giornata impegnativa."
  },
  {
    id: 7,
    inhale: 6,
    holdIn: 0,
    exhale: 2,
    holdOut: 0,
    duration: 2,
    cycles: 15,
    label: "Awake",
    description:
      "Respirazione breve e incisiva da praticare al risveglio: stimola energia, chiarezza mentale e attiva il sistema nervoso in modo delicato. Ottima al mattino o prima di iniziare una giornata impegnativa."
  },
  {
    id: 8,
    inhale: 7,
    holdIn: 4,
    exhale: 8,
    holdOut: 4,
    duration: 4,
    cycles: 10,
    label: "Pranayama",
    description:
      "Pratica yogica antica, il Pranayama è il respiro consapevole del “prana” (energia vitale). Migliora la capacità polmonare, riduce ansia e pressione, e favorisce equilibrio mentale. Ideale in momenti meditativi o per integrare yoga e mindfulness."
  },
  {
    id: 9,
    inhale: 7,
    holdIn: 0,
    exhale: 7,
    holdOut: 0,
    duration: 3,
    cycles: 13,
    label: "Ujjayi",
    description:
      "Conosciuto anche come “respiro vittorioso”, Ujjayi crea un suono interno simile a onde marine. Favorisce calore, concentrazione e calma interiore. Ottimo durante pratiche yoga, meditazione o nei momenti in cui desideri stabilità mentale."
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
