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

// food / substitute item
const FoodItemSchema = z.object({
  name: z.string(),
  quantity: z.union([z.number(), z.string()]).optional(),
  unit: z.string().optional(),
  _id: z.string().optional()
});

// supplement item
const SupplementItemSchema = z.object({
  name: z.string(),
  quantity: z.union([z.number(), z.string()]).optional(),
  unit: z.string().optional(),
  _id: z.string().optional()
});

// meal structure (breakfast, lunch, ecc.)
const MealSchema = z.object({
  foods: z.array(FoodItemSchema).optional(),
  substitutes: z.array(FoodItemSchema).optional(),
  _id: z.string().optional()
});

// supplementation
const SupplementationSchema = z
  .object({
    supplements: z.array(SupplementItemSchema).optional(),
    substitutes: z.array(SupplementItemSchema).optional()
  })
  .optional();

// daily plan wrapper
const DailyPlanSchema = z.object({
  day: z.string(),
  plan: z.object({
    supplementation: SupplementationSchema.optional(),
    breakfast: MealSchema.optional(),
    morningSnack: MealSchema.optional(),
    lunch: MealSchema.optional(),
    afternoonSnack: MealSchema.optional(),
    dinner: MealSchema.optional(),
    _id: z.string().optional()
  }),
  _id: z.string().optional()
});

// dieta / plan settimanale
const DietSchema = z.object({
  name: z.string().optional(),
  goal: z.string().optional(),
  notes: z.string().optional(),
  duration: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.boolean().optional(),
  type: z.string().optional(),
  weeklyPlan: z.array(DailyPlanSchema).optional(),
  _id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
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
