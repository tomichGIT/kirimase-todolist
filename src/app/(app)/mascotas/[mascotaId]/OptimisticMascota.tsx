"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/mascotas/useOptimisticMascotas";
import { type Mascota } from "@/lib/db/schema/mascotas";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import MascotaForm from "@/components/mascotas/MascotaForm";


export default function OptimisticMascota({ 
  mascota,
   
}: { 
  mascota: Mascota; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Mascota) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticMascota, setOptimisticMascota] = useOptimistic(mascota);
  const updateMascota: TAddOptimistic = (input) =>
    setOptimisticMascota({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <MascotaForm
          mascota={mascota}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateMascota}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{mascota.nombre}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticMascota.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticMascota, null, 2)}
      </pre>
    </div>
  );
}
