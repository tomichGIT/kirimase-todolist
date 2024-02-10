"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Mascota, CompleteMascota } from "@/lib/db/schema/mascotas";
import Modal from "@/components/shared/Modal";

import { useOptimisticMascotas } from "@/app/(app)/mascotas/useOptimisticMascotas";
import { Button } from "@/components/ui/button";
import MascotaForm from "./MascotaForm";
import { PlusIcon } from "lucide-react";

// Voy a tratar de mostrar el usuario autenticado como dueño de la mascota
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthSession } from "@/lib/auth/utils";

type TOpenModal = (mascota?: Mascota) => void;

//export default function MascotaList({ mascotas }: { mascotas: CompleteMascota[] }) {
export default function MascotaList({ mascotas, session }: { mascotas: CompleteMascota[]; session: AuthSession["session"] }) {
   const { optimisticMascotas, addOptimisticMascota } = useOptimisticMascotas(mascotas);
   const [open, setOpen] = useState(false);
   const [activeMascota, setActiveMascota] = useState<Mascota | null>(null);
   const openModal = (mascota?: Mascota) => {
      setOpen(true);
      mascota ? setActiveMascota(mascota) : setActiveMascota(null);
   };
   const closeModal = () => setOpen(false);

   return (
      <div>
         <Modal open={open} setOpen={setOpen} title={activeMascota ? "Edit Mascota" : "Create Mascota"}>
            <MascotaForm mascota={activeMascota} addOptimistic={addOptimisticMascota} openModal={openModal} closeModal={closeModal} />
         </Modal>
         <div className="absolute right-0 top-0 ">
            <Button onClick={() => openModal()} variant={"outline"}>
               +
            </Button>
         </div>
         {optimisticMascotas.length === 0 ? (
            <EmptyState openModal={openModal} />
         ) : (
            <ul>
               {/* <li>session es: {JSON.stringify(session)}</li> */}
               {optimisticMascotas.map((mascota) => (
                  // <Mascota mascota={mascota} key={mascota.id} openModal={openModal} />
                  <Mascota mascota={mascota} key={mascota.id} openModal={openModal} session={session} />
               ))}
            </ul>
         )}
      </div>
   );
}

//const Mascota = ({ mascota, openModal }: { mascota: CompleteMascota; openModal: TOpenModal }) => {
const Mascota = ({ mascota, openModal, session }: { mascota: CompleteMascota; openModal: TOpenModal; session: any }) => {
   const optimistic = mascota.id === "optimistic";
   const deleting = mascota.id === "delete";
   const mutating = optimistic || deleting;
   const pathname = usePathname();
   const basePath = pathname.includes("mascotas") ? pathname : pathname + "/mascotas/";

   return (
      <li className={cn("flex justify-between my-2", mutating ? "opacity-30 animate-pulse" : "", deleting ? "text-destructive" : "")}>
         <div className="w-full">
            {/* <div>{mascota.nombre}</div> */}

            <div className="flex direction-alternate gap-2 items-center mt-2">
               <Avatar>
                  <AvatarFallback>{session?.user.name[0]}</AvatarFallback>
                  <AvatarImage src={session?.user.image} alt={session?.user.name} />
               </Avatar>
               <div>{session?.user.name}</div>
               <div>
                  <strong>{mascota.nombre}</strong>
               </div>
               <div>({mascota.createdAt?.toLocaleString("es-ES")})</div>
            </div>
         </div>
         <Button variant={"link"} asChild>
            <Link href={basePath + "/" + mascota.id}>Edit</Link>
         </Button>
      </li>
   );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
   return (
      <div className="text-center">
         <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">No mascotas</h3>
         <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new mascota.</p>
         <div className="mt-6">
            <Button onClick={() => openModal()}>
               <PlusIcon className="h-4" /> New Mascotas{" "}
            </Button>
         </div>
      </div>
   );
};
