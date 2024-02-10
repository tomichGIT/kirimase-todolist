"use server";

import { revalidatePath } from "next/cache";
import {
  createMascota,
  deleteMascota,
  updateMascota,
} from "@/lib/api/mascotas/mutations";
import {
  MascotaId,
  NewMascotaParams,
  UpdateMascotaParams,
  mascotaIdSchema,
  insertMascotaParams,
  updateMascotaParams,
} from "@/lib/db/schema/mascotas";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateMascotas = () => revalidatePath("/mascotas");

export const createMascotaAction = async (input: NewMascotaParams) => {
  try {
    const payload = insertMascotaParams.parse(input);
    await createMascota(payload);
    revalidateMascotas();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateMascotaAction = async (input: UpdateMascotaParams) => {
  try {
    const payload = updateMascotaParams.parse(input);
    await updateMascota(payload.id, payload);
    revalidateMascotas();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteMascotaAction = async (input: MascotaId) => {
  try {
    const payload = mascotaIdSchema.parse({ id: input });
    await deleteMascota(payload.id);
    revalidateMascotas();
  } catch (e) {
    return handleErrors(e);
  }
};