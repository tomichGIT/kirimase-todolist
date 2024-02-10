import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const mascotaSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string().nullish(),
  edad: z.number().int().nullish(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullish(),
})

export interface CompleteMascota extends z.infer<typeof mascotaSchema> {
  user: CompleteUser
}

/**
 * relatedMascotaSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMascotaSchema: z.ZodSchema<CompleteMascota> = z.lazy(() => mascotaSchema.extend({
  user: relatedUserSchema,
}))
