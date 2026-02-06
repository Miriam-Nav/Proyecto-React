import { z } from "zod";

export const UsuarioSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio"),

  email: z
    .string()
    .email("Email no válido")
    .optional()
    .or(z.literal("")),

  telefono: z
    .string()
    .regex(/^\d+$/, "Solo se permiten números")
    .min(6, "Teléfono demasiado corto")
    .optional()
    .or(z.literal("")),
});

export type UsuarioFormValues = z.infer<typeof UsuarioSchema>;
