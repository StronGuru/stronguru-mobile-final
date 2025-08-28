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

// Schema per nutrition, training, psychology
const NutritionSchema = z.object({
  _id: z.string(),
  bia: z.array(z.any()),
  measurements: z.array(z.any()),
  diets: z.array(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const TrainingSchema = z.object({
  _id: z.string(),
  goals: z.array(z.any()),
  injuries: z.array(z.any()),
  trainingPlans: z.array(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const PsychologySchema = z.object({
  _id: z.string(),
  issues: z.array(z.any()),
  goals: z.array(z.any()),
  createdAt: z.string(),
  updatedAt: z.string()
});

// Schema per Profile completo
export const ProfileSchema = z.object({
  _id: z.string(),
  createdBy: ProfessionalSchema,
  connectedUser: z.string(),
  status: z.string(),
  notes: z.string().optional(),
  nutrition: NutritionSchema,
  training: TrainingSchema,
  psychology: PsychologySchema,
  createdAt: z.string(),
  updatedAt: z.string()
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
