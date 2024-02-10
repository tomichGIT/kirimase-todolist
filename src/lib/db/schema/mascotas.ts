import { mascotaSchema } from "@/zodAutoGenSchemas";
import { z } from "zod";
import { timestamps } from "@/lib/utils";
import { getMascotas } from "@/lib/api/mascotas/queries";

// Schema for mascotas - used to validate API requests
const baseSchema = mascotaSchema.omit(timestamps);

export const insertMascotaSchema = baseSchema.omit({ id: true });
export const insertMascotaParams = baseSchema
   .extend({
      edad: z.coerce.number(),
   })
   .omit({
      id: true,
      userId: true,
   });

export const updateMascotaSchema = baseSchema;
export const updateMascotaParams = updateMascotaSchema
   .extend({
      edad: z.coerce.number(),
   })
   .omit({
      userId: true,
   });
export const mascotaIdSchema = baseSchema.pick({ id: true });

// Types for mascotas - used to type API request params and within Components
export type Mascota = z.infer<typeof mascotaSchema>;
export type NewMascota = z.infer<typeof insertMascotaSchema>;
export type NewMascotaParams = z.infer<typeof insertMascotaParams>;
export type UpdateMascotaParams = z.infer<typeof updateMascotaParams>;
export type MascotaId = z.infer<typeof mascotaIdSchema>["id"];

// this type infers the return from getMascotas() - meaning it will include any joins
export type CompleteMascota = Awaited<ReturnType<typeof getMascotas>>["mascotas"][number];
