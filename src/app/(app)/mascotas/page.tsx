import { Suspense } from "react";

import Loading from "@/app/loading";
import MascotaList from "@/components/mascotas/MascotaList";
import { getMascotas } from "@/lib/api/mascotas/queries";

//import { checkAuth } from "@/lib/auth/utils";
import { checkAuth, getUserAuth } from "@/lib/auth/utils";
import { set } from "zod";

export const revalidate = 0;

export default async function MascotasPage() {
   await checkAuth();

   // opcioonal, lo uso solo para mandarle mis datos de session a un clientComponent.
   // podría usar Zustand para manejar el estado de la sesión
   // podría usar el hook useAuth() en el clientComponent (autocompletado por AI, no se si existe useAuth)
   const { session } = await getUserAuth();

   const { mascotas } = await getMascotas();

   return (
      <main>
         <div className="relative">
            <div className="flex justify-between">
               <h1 className="font-semibold text-2xl my-2">Mascotas</h1>
            </div>

            <Suspense fallback={<Loading />}>
               {/* <MascotaList mascotas={mascotas} /> */}
               <MascotaList mascotas={mascotas} session={session} />
            </Suspense>
         </div>
      </main>
   );
}
