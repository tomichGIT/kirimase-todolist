import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createMascota, deleteMascota, updateMascota } from "@/lib/api/mascotas/mutations";

// hecho por mí
import { getMascotas, getMascotaById } from "@/lib/api/mascotas/queries";

import { mascotaIdSchema, insertMascotaParams, updateMascotaParams } from "@/lib/db/schema/mascotas";

export async function GET(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      if (id) {
         console.log("id", id);
         const validatedParams = mascotaIdSchema.parse({ id });
         console.log("validatedParams", validatedParams);
         const mascotas = await getMascotaById(validatedParams.id);
         return NextResponse.json(mascotas, { status: 200 }); // devuelve una mascota
      }

      // devuelve múltiples mascotas
      const mascotas = await getMascotas();
      return NextResponse.json(mascotas, { status: 200 });
   } catch (err) {
      if (err instanceof z.ZodError) {
         return NextResponse.json({ error: err.issues }, { status: 400 });
      } else {
         return NextResponse.json(err, { status: 500 });
      }
   }
}

export async function POST(req: Request) {
   try {
      const validatedData = insertMascotaParams.parse(await req.json());
      const { mascota } = await createMascota(validatedData);

      revalidatePath("/mascotas"); // optional - assumes you will have named route same as entity

      return NextResponse.json(mascota, { status: 201 });
   } catch (err) {
      if (err instanceof z.ZodError) {
         return NextResponse.json({ error: err.issues }, { status: 400 });
      } else {
         return NextResponse.json(err, { status: 500 });
      }
   }
}

export async function PUT(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      const validatedData = updateMascotaParams.parse(await req.json());
      const validatedParams = mascotaIdSchema.parse({ id });

      const { mascota } = await updateMascota(validatedParams.id, validatedData);

      return NextResponse.json(mascota, { status: 200 });
   } catch (err) {
      if (err instanceof z.ZodError) {
         return NextResponse.json({ error: err.issues }, { status: 400 });
      } else {
         return NextResponse.json(err, { status: 500 });
      }
   }
}

export async function DELETE(req: Request) {
   try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");

      const validatedParams = mascotaIdSchema.parse({ id });
      const { mascota } = await deleteMascota(validatedParams.id);

      return NextResponse.json(mascota, { status: 200 });
   } catch (err) {
      if (err instanceof z.ZodError) {
         return NextResponse.json({ error: err.issues }, { status: 400 });
      } else {
         return NextResponse.json(err, { status: 500 });
      }
   }
}
