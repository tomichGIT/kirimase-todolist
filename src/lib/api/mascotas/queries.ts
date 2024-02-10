import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { type MascotaId, mascotaIdSchema } from "@/lib/db/schema/mascotas";

export const getMascotas = async () => {
  const { session } = await getUserAuth();
  const m = await db.mascota.findMany({ where: {userId: session?.user.id!}});
  return { mascotas: m };
};

export const getMascotaById = async (id: MascotaId) => {
  const { session } = await getUserAuth();
  const { id: mascotaId } = mascotaIdSchema.parse({ id });
  const m = await db.mascota.findFirst({
    where: { id: mascotaId, userId: session?.user.id!}});
  return { mascota: m };
};


