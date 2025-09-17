import { z } from "zod";

// Enums
const GenderEnum = z.enum(["male", "female", "other"]);
const FitnessLevelEnum = z.enum(["beginner", "intermediate", "advanced"]);
const ActivityLevelEnum = z.enum(["sedentary", "lightly_active", "moderately_active", "very_active"]);
const CompetitiveLevelEnum = z.enum(["beginner", "intermediate", "advanced"]);
const GoalsEnum = z.enum(["weight_loss", "muscle_gain", "endurance", "flexibility"]);
const PreferencesEnum = z.enum(["vegan", "vegetarian", "gluten_free", "dairy_free"]);

// 🎯 Schema per Professional (professionista)
export const ProfessionalSchema = z.object({
  _id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  specializations: z.array(z.string()),
  contactPhone: z.string().optional(),
  profileImg: z.string().optional()
});

// ------------------ Nutrition sub-schemas (più dettagliati) ------------------

// singola voce BIA
const BiaEntrySchema = z.object({
  examDate: z.string(),
  fatMassKg: z.number().optional(),
  leanMassKg: z.number().optional(),
  totalBodyWaterL: z.number().optional(),
  intracellularWaterL: z.number().optional(),
  extracellularWaterL: z.number().optional(),
  basalMetabolismKg: z.number().optional(),
  phaseAngle: z.number().optional(),
  muscleMassIndex: z.number().optional(),
  visceralFatIndex: z.number().optional(),
  _id: z.string().optional()
});

// singola misurazione antropometrica
const MeasurementEntrySchema = z.object({
  date: z.string(),
  weightKg: z.number().optional(),
  heightCm: z.number().optional(),
  bmi: z.number().optional(),
  neckCm: z.number().optional(),
  shouldersCm: z.number().optional(),
  chestCm: z.number().optional(),
  waistCm: z.number().optional(),
  abdomenCm: z.number().optional(),
  armCm: z.number().optional(),
  hipsCm: z.number().optional(),
  glutesCm: z.number().optional(),
  legsCm: z.number().optional(),
  thighCm: z.number().optional(),
  innerThighCm: z.number().optional(),
  calfCm: z.number().optional(),
  notes: z.string().optional(),
  _id: z.string().optional()
});

const FoodItemSchema = z.object({
  name: z.string(),
  quantity: z.number(), // Nei tuoi dati è sempre number, non union
  unit: z.string(),
  _id: z.string()
});

// supplement item (stesso del food)
const SupplementItemSchema = z.object({
  name: z.string(),
  quantity: z.number(), // Nei tuoi dati è sempre number
  unit: z.string(),
  _id: z.string()
});

// meal structure - i campi sono sempre presenti nei tuoi dati
const MealSchema = z.object({
  foods: z.array(FoodItemSchema),
  substitutes: z.array(FoodItemSchema),
  _id: z.string()
});

// supplementation - sempre presente nella struttura
const SupplementationSchema = z.object({
  supplements: z.array(SupplementItemSchema),
  substitutes: z.array(SupplementItemSchema)
});

// daily plan schema - corretto per matchare la struttura reale
const DailyPlanSchema = z.object({
  supplementation: SupplementationSchema,
  breakfast: MealSchema,
  morningSnack: MealSchema,
  lunch: MealSchema,
  afternoonSnack: MealSchema,
  dinner: MealSchema,
  _id: z.string()
});

// weekly plan item - il "day" ha valori specifici
const WeeklyPlanItemSchema = z.object({
  day: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
  plan: DailyPlanSchema,
  _id: z.string()
});

// dieta schema - corretto per i campi obbligatori nei tuoi dati
const DietSchema = z.object({
  _id: z.string(),
  name: z.string(),
  goal: z.string(),
  notes: z.string(),
  duration: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.boolean(),
  type: z.string(),
  weeklyPlan: z.array(WeeklyPlanItemSchema),
  createdAt: z.string(),
  updatedAt: z.string()
});

// ------------------ Nutrition, Training, Psychology schemi ------------------

const NutritionSchema = z.object({
  _id: z.string(),
  bia: z.array(BiaEntrySchema).optional(),
  measurements: z.array(MeasurementEntrySchema).optional(),
  diets: z.array(DietSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

const TrainingSchema = z.object({
  _id: z.string(),
  goals: z.array(z.any()).optional(),
  injuries: z.array(z.any()).optional(),
  trainingPlans: z.array(z.any()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

const PsychologySchema = z.object({
  _id: z.string(),
  issues: z.array(z.any()).optional(),
  goals: z.array(z.any()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// Schema per Profile completo
export const ProfileSchema = z.object({
  _id: z.string(),
  createdBy: ProfessionalSchema,
  connectedUser: z.string(),
  status: z.string(),
  notes: z.string().optional(),
  nutrition: NutritionSchema.optional().nullable(),
  training: TrainingSchema.optional().nullable(),
  psychology: PsychologySchema.optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// 🎯 Schema User - solo firstName, lastName, email obbligatori
export const UserSchema = z.object({
  _id: z.string(),
  firstName: z.string(), // ✅ Required
  lastName: z.string(), // ✅ Required
  email: z.string().email(), // ✅ Required

  // Tutto il resto opzionale
  role: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: GenderEnum.optional(),
  phone: z.string().optional(),
  subscription: z.object({}).optional(), // Da definire meglio in futuro
  healthData: z
    .object({
      height: z.number().optional(),
      weight: z.number().optional()
    })
    .optional(),
  fitnessLevel: FitnessLevelEnum.optional(),
  goals: z.array(GoalsEnum).optional(),
  activityLevel: ActivityLevelEnum.optional(),
  preferences: z.array(PreferencesEnum).optional(),
  currentSports: z.array(z.string()).optional(),
  competitiveLevel: CompetitiveLevelEnum.optional(),
  isTemporary: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  ambassador: z.boolean().optional(),
  acceptedTerms: z.boolean().optional(),
  acceptedPrivacy: z.boolean().optional(),
  profiles: z.array(ProfileSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// Export tipi inferiti
export type UserType = z.infer<typeof UserSchema>;
export type ProfessionalType = z.infer<typeof ProfessionalSchema>;
export type ProfileType = z.infer<typeof ProfileSchema>;
export type NutritionType = z.infer<typeof NutritionSchema>;
export type DietType = z.infer<typeof DietSchema>;
export type BiaEntryType = z.infer<typeof BiaEntrySchema>;
export type MeasurementEntryType = z.infer<typeof MeasurementEntrySchema>;
export type FoodItemType = z.infer<typeof FoodItemSchema>;
export type SupplementItemType = z.infer<typeof SupplementItemSchema>;
export type MealType = z.infer<typeof MealSchema>;
export type SupplementationType = z.infer<typeof SupplementationSchema>;
export type DailyPlanType = z.infer<typeof DailyPlanSchema>;
export type WeeklyPlanItemType = z.infer<typeof WeeklyPlanItemSchema>;
