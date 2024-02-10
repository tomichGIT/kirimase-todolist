import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getMascotaById } from "@/lib/api/mascotas/queries";
import OptimisticMascota from "./OptimisticMascota";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function MascotaPage({
  params,
}: {
  params: { mascotaId: string };
}) {

  return (
    <main className="overflow-auto">
      <Mascota id={params.mascotaId} />
    </main>
  );
}

const Mascota = async ({ id }: { id: string }) => {
  await checkAuth();

  const { mascota } = await getMascotaById(id);
  

  if (!mascota) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="mascotas" />
        <OptimisticMascota mascota={mascota}  />
      </div>
    </Suspense>
  );
};
