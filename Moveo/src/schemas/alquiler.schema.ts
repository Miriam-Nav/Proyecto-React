import { z } from "zod";

export const AlquilerSchema = z.object({
  cliente_id: z.number().min(1, "Selecciona un cliente"),
  videojuego_id: z.number().min(1, "Selecciona un videojuego"),
  fecha_inicio: z.string().min(1, "Fecha obligatoria"),
  fecha_fin_prevista: z.string().min(1, "Fecha obligatoria"),
  total_pagado: z.number().min(0),
});

export type AlquilerFormValues = z.infer<typeof AlquilerSchema>;
