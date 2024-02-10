import { type Mascota, type CompleteMascota } from "@/lib/db/schema/mascotas";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Mascota>) => void;

export const useOptimisticMascotas = (mascotas: CompleteMascota[]) => {
   const [optimisticMascotas, addOptimisticMascota] = useOptimistic(mascotas, (currentState: CompleteMascota[], action: OptimisticAction<Mascota>): CompleteMascota[] => {
      const { data } = action;

      const optimisticMascota = {
         ...data,
         descripcion: data.descripcion ?? null, // this is a nullable field
         edad: data.edad ?? null, // this is a nullable field
         deletedAt: data.deletedAt ?? null, // this is a nullable field
         id: "optimistic",
      };

      switch (action.action) {
         case "create":
            return currentState.length === 0 ? [optimisticMascota] : [...currentState, optimisticMascota];
         case "update":
            return currentState.map((item) => (item.id === data.id ? { ...item, ...optimisticMascota } : item));
         case "delete":
            return currentState.map((item) => (item.id === data.id ? { ...item, id: "delete" } : item));
         default:
            return currentState;
      }
   });

   return { addOptimisticMascota, optimisticMascotas };
};
