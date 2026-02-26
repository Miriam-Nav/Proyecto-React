import { z } from "zod";

// Preprocessor para convertir string a número
const stringToNumber = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? undefined : parsed;
    }
    return val;
  },
  z.number({ invalid_type_error: "Debe ser un número" })
);

export const VideojuegoSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título es obligatorio"),
  plataforma: z
    .string()
    .min(1, "La plataforma es obligatoria"),
  genero: z
    .string()
    .optional()
    .or(z.literal("")),
  precio_alquiler_dia: stringToNumber
    .refine((val) => val > 0, { message: "El precio debe ser mayor a 0" }),
  stock: stringToNumber
    .refine((val) => Number.isInteger(val), { message: "Debe ser un número entero" })
    .refine((val) => val >= 0, { message: "El stock no puede ser negativo" })
    .optional()
    .or(z.literal(0)),
});

export type VideojuegoFormValues = z.infer<typeof VideojuegoSchema>;
