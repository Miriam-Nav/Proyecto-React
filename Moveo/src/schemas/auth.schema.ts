import { z } from "zod";

export const AuthSchema = z.object({
  email: z
    .string()
    .email("Email no válido")
    .or(z.literal("")),

  passwd: z
    .string()
    .or(z.literal("")),
});

export type AuthFormValues = z.infer<typeof AuthSchema>;
