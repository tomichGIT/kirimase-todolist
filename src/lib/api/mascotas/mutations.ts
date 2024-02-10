import { db } from "@/lib/db/index";
import { MascotaId, NewMascotaParams, UpdateMascotaParams, updateMascotaSchema, insertMascotaSchema, mascotaIdSchema } from "@/lib/db/schema/mascotas";
import { getUserAuth } from "@/lib/auth/utils";

export const createMascota = async (mascota: NewMascotaParams) => {
   const { session } = await getUserAuth();
   const newMascota = insertMascotaSchema.parse({ ...mascota, userId: session?.user.id! });
   try {
      const m = await db.mascota.create({ data: newMascota });
      return { mascota: m };
   } catch (err) {
      const message = (err as Error).message ?? "Error, please try again";
      console.error(message);
      throw { error: message };
   }
};

export const updateMascota = async (id: MascotaId, mascota: UpdateMascotaParams) => {
   const { session } = await getUserAuth();
   const { id: mascotaId } = mascotaIdSchema.parse({ id });
   const newMascota = updateMascotaSchema.parse({ ...mascota, userId: session?.user.id! });
   try {
      const m = await db.mascota.update({ where: { id: mascotaId, userId: session?.user.id! }, data: newMascota });
      return { mascota: m };
   } catch (err) {
      const message = (err as Error).message ?? "Error, please try again";
      console.error(message);
      throw { error: message };
   }
};

export const deleteMascota = async (id: MascotaId) => {
   const { session } = await getUserAuth();
   const { id: mascotaId } = mascotaIdSchema.parse({ id });
   try {
      const m = await db.mascota.delete({ where: { id: mascotaId, userId: session?.user.id! } });
      return { mascota: m };
   } catch (err) {
      const message = (err as Error).message ?? "Error, please try again";
      console.error(message);
      throw { error: message };
   }
};
