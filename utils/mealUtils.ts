export interface MealTimeRange {
  start: number; // minuti dalla mezzanotte (es. 360 = 06:00)
  end: number;
}

// Fasce orarie aggiornate come richiesto
export const mealTimeRanges: Record<string, MealTimeRange> = {
  breakfast: { start: 360, end: 600 }, // 06:00 - 10:00
  morningSnack: { start: 601, end: 720 }, // 10:01 - 12:00
  lunch: { start: 721, end: 900 }, // 12:01 - 15:00
  afternoonSnack: { start: 901, end: 1080 }, // 15:01 - 18:00
  dinner: { start: 1081, end: 1320 } // 18:01 - 22:00
};

export const dayMapping: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};

/**
 * Determina il pasto corrente basato sull'orario attuale
 * @returns Il nome del pasto corrente o null se è dopo le 22:00
 */
export function getCurrentMealTime(): string | null {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  for (const [mealKey, range] of Object.entries(mealTimeRanges)) {
    if (minutes >= range.start && minutes <= range.end) {
      return mealKey;
    }
  }

  return null; // Dopo le 22:00 o prima delle 06:00
}

/**
 * Ottiene la chiave del giorno corrente
 * @returns La chiave del giorno (es. 'monday', 'tuesday', etc.)
 */
export function getCurrentDayKey(): string {
  const now = new Date();
  return dayMapping[now.getDay()];
}

/**
 * Ottiene la chiave del giorno successivo
 * @param currentDay Giorno corrente
 * @returns La chiave del giorno successivo
 */
export function getNextDayKey(currentDay: string): string {
  const days = Object.values(dayMapping);
  const currentIndex = days.indexOf(currentDay);
  const nextIndex = (currentIndex + 1) % days.length;
  return days[nextIndex];
}

/**
 * Verifica se un pasto ha contenuto
 * @param meal Il pasto da controllare
 * @returns true se il pasto ha contenuto
 */
export function hasMealContent(meal: any): boolean {
  if (!meal) return false;

  // Per i pasti normali
  if ("foods" in meal) {
    return meal.foods.length > 0 || meal.substitutes.length > 0;
  }

  // Per gli integratori
  if ("supplements" in meal) {
    return meal.supplements.length > 0 || meal.substitutes.length > 0;
  }

  return false;
}

/**
 * Trova il prossimo pasto disponibile partendo da un giorno specifico
 * @param weeklyPlan Il piano settimanale completo
 * @param startDay Giorno di partenza (opzionale, default: giorno corrente)
 * @param startMeal Pasto di partenza (opzionale, per cercare dal pasto successivo)
 * @returns Oggetto con giorno e pasto trovati, o null se nessun pasto disponibile
 */
export function findNextAvailableMeal(weeklyPlan: any, startDay?: string, startMeal?: string): { day: string; meal: string } | null {
  const days = Object.values(dayMapping);
  const mealKeys = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];

  const currentDayKey = startDay || getCurrentDayKey();
  let dayIndex = days.indexOf(currentDayKey);

  // Se abbiamo un pasto di partenza, inizia dalla sezione successiva
  let startMealIndex = 0;
  if (startMeal && mealKeys.includes(startMeal)) {
    startMealIndex = mealKeys.indexOf(startMeal) + 1;
  }

  // Cerca per massimo 7 giorni
  for (let dayCount = 0; dayCount < 7; dayCount++) {
    const dayKey = days[dayIndex];
    const dayPlan = weeklyPlan[dayKey];

    if (dayPlan && dayPlan.plan) {
      const mealStartIndex = dayCount === 0 ? startMealIndex : 0;

      for (let mealIndex = mealStartIndex; mealIndex < mealKeys.length; mealIndex++) {
        const mealKey = mealKeys[mealIndex];
        const meal = dayPlan.plan[mealKey];

        if (hasMealContent(meal)) {
          console.log(`Found next available meal: ${mealKey} on ${dayKey}`);
          return { day: dayKey, meal: mealKey };
        }
      }
    }

    dayIndex = (dayIndex + 1) % days.length;
  }

  console.log("No available meals found in weekly plan");
  return null;
}

/**
 * Determina il pasto da selezionare automaticamente considerando fallback
 * @param weeklyPlan Il piano settimanale completo
 * @param currentDayPlan Il piano del giorno corrente
 * @returns Oggetto con il pasto da selezionare o null
 */
export function getAutoSelectedMeal(weeklyPlan: any, currentDayPlan: any): { meal: string; reason: string } | null {
  const currentMeal = getCurrentMealTime();
  const currentDay = getCurrentDayKey();

  // Caso 1: Siamo in una fascia oraria specifica
  if (currentMeal) {
    const meal = currentDayPlan.plan[currentMeal];

    if (hasMealContent(meal)) {
      return { meal: currentMeal, reason: "current-time-slot" };
    }

    // Cerca dal pasto successivo dello stesso giorno
    const nextMeal = findNextAvailableMeal(weeklyPlan, currentDay, currentMeal);
    if (nextMeal && nextMeal.day === currentDay) {
      return { meal: nextMeal.meal, reason: "next-meal-same-day" };
    }
  }

  // Caso 2: Dopo le 22:00 o nessun pasto nella fascia corrente
  // Cerca il primo pasto disponibile del giorno successivo
  const nextDay = getNextDayKey(currentDay);
  const nextAvailable = findNextAvailableMeal(weeklyPlan, nextDay);

  if (nextAvailable) {
    return { meal: nextAvailable.meal, reason: "next-day-fallback" };
  }

  return null;
}

/**
 * Determina quale giorno dovrebbe essere selezionato automaticamente
 * @param weeklyPlan Il piano settimanale completo
 * @returns La chiave del giorno da selezionare
 */
export function getAutoSelectedDay(weeklyPlan: any): string {
  const currentDay = getCurrentDayKey();
  const currentMeal = getCurrentMealTime();

  // Se siamo in una fascia oraria specifica, controlla se il giorno corrente ha contenuto
  if (currentMeal) {
    const todayPlan = weeklyPlan[currentDay];
    if (todayPlan && todayPlan.plan) {
      const meal = todayPlan.plan[currentMeal];
      if (hasMealContent(meal)) {
        return currentDay;
      }

      // Cerca altri pasti nel giorno corrente
      const mealKeys = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];
      for (const mealKey of mealKeys) {
        const dayMeal = todayPlan.plan[mealKey];
        if (hasMealContent(dayMeal)) {
          return currentDay;
        }
      }
    }
  }

  // Fallback: cerca il prossimo giorno con contenuto
  const nextAvailable = findNextAvailableMeal(weeklyPlan, currentDay);
  if (nextAvailable) {
    return nextAvailable.day;
  }

  // Default: giorno corrente
  return currentDay;
}
