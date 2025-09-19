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
 * Determina il prossimo pasto basato sull'orario attuale
 * Utile per transizioni tra fasce orarie
 * @returns Il nome del prossimo pasto o null
 */
export function getNextMealTime(): string | null {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();

  const mealOrder = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];

  for (const mealKey of mealOrder) {
    const range = mealTimeRanges[mealKey];
    if (minutes < range.start) {
      return mealKey; // Primo pasto che inizia dopo l'orario corrente
    }
  }

  return null; // Dopo tutti i pasti (dopo le 22:00)
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
          return { day: dayKey, meal: mealKey };
        }
      }
    }

    dayIndex = (dayIndex + 1) % days.length;
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

  // Se siamo in una fascia oraria specifica (06:00-22:00)
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

  // Se currentMeal è null (dopo le 22:00 o prima delle 06:00)
  // oppure nessun pasto trovato nel giorno corrente,
  // cerca il prossimo giorno con contenuto

  // IMPORTANTE: Se siamo dopo le 22:00, inizia la ricerca dal giorno SUCCESSIVO
  const searchStartDay = currentMeal === null ? getNextDayKey(currentDay) : currentDay;
  const nextAvailable = findNextAvailableMeal(weeklyPlan, searchStartDay);

  if (nextAvailable) {
    console.log(`Found next available: ${nextAvailable.day} - ${nextAvailable.meal}`);
    return nextAvailable.day;
  }

  console.log(`No meals found, defaulting to current day: ${currentDay}`);
  return currentDay;
}

/**
 * Determina il pasto da selezionare automaticamente considerando fallback
 * @param weeklyPlan Il piano settimanale completo
 * @param currentDayPlan Il piano del giorno selezionato
 * @returns Oggetto con il pasto da selezionare o null
 */
export function getAutoSelectedMeal(weeklyPlan: any, currentDayPlan: any): { meal: string; reason: string } | null {
  const currentMeal = getCurrentMealTime();
  const nextMeal = getNextMealTime();
  const currentDay = getCurrentDayKey();
  const selectedDay = Object.keys(weeklyPlan).find((day) => weeklyPlan[day] === currentDayPlan);

  console.log(`getAutoSelectedMeal: currentMeal=${currentMeal}, nextMeal=${nextMeal}, currentDay=${currentDay}, selectedDay=${selectedDay}`);

  // PRIORITY 1: Se siamo in una fascia oraria specifica (06:00-22:00)
  if (currentMeal) {
    console.log(`Checking current meal time slot: ${currentMeal}`);

    // Prima controlla se il pasto corrente ha contenuto (indipendentemente dal giorno)
    const currentMealData = currentDayPlan.plan[currentMeal];
    if (hasMealContent(currentMealData)) {
      console.log(`Selecting current time slot meal: ${currentMeal} (has content, regardless of day)`);
      return { meal: currentMeal, reason: "current-time-slot" };
    }

    // Se il pasto corrente è vuoto, prova il prossimo pasto imminente
    if (nextMeal) {
      const nextMealData = currentDayPlan.plan[nextMeal];
      if (hasMealContent(nextMealData)) {
        console.log(`Selecting next imminent meal: ${nextMeal} (current meal empty)`);
        return { meal: nextMeal, reason: "next-imminent-meal" };
      }
    }

    // Se stiamo guardando il giorno corrente, cerca altri pasti dello stesso giorno
    if (selectedDay === currentDay) {
      const nextAvailableMeal = findNextAvailableMeal(weeklyPlan, currentDay, currentMeal);
      if (nextAvailableMeal && nextAvailableMeal.day === currentDay) {
        console.log(`Selecting next available meal same day: ${nextAvailableMeal.meal}`);
        return { meal: nextAvailableMeal.meal, reason: "next-meal-same-day" };
      }
    }
  }

  // PRIORITY 2: Per tutti gli altri casi (dopo le 22:00, giorno diverso, etc.)
  // cerca il primo pasto disponibile del giorno selezionato
  console.log(`Searching first available meal in selected day (fallback)`);
  const mealKeys = ["breakfast", "morningSnack", "lunch", "afternoonSnack", "dinner"];
  for (const mealKey of mealKeys) {
    const meal = currentDayPlan.plan[mealKey];
    if (hasMealContent(meal)) {
      console.log(`Found first available meal: ${mealKey}`);
      return { meal: mealKey, reason: "first-available-selected-day" };
    }
  }

  console.log(`No meals found in selected day`);
  return null;
}
