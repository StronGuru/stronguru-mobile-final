import { z } from "zod";

//SIGNUP
export const RegistrationSchema = z.object({
  firstName: z.string().min(2, "Il nome deve essere di almeno 2 caratteri"),
  lastName: z.string().min(2, "Il cognome deve essere di almeno 2 caratteri"),
  email: z.string().email("Inserisci un'email valida"),
  password: z
    .string()
    .min(6, "La password deve essere di almeno 6 caratteri")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
      "La password deve contenere almeno: una lettera minuscola, una maiuscola, un numero e un carattere speciale"
    ),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: "Devi accettare i termini e condizioni"
  }),
  acceptedPrivacy: z.boolean().refine((val) => val === true, {
    message: "Devi accettare la privacy policy"
  })
});

export type RegistrationType = z.infer<typeof RegistrationSchema>;

//FORGOT PASSWORD
export const ForgotPasswordSchema = z.object({
  email: z.email("Inserisci un'email valida")
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
