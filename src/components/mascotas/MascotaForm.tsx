import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/mascotas/useOptimisticMascotas";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import { type Mascota, insertMascotaParams } from "@/lib/db/schema/mascotas";
import {
  createMascotaAction,
  deleteMascotaAction,
  updateMascotaAction,
} from "@/lib/actions/mascotas";


const MascotaForm = ({
  
  mascota,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  mascota?: Mascota | null;
  
  openModal?: (mascota?: Mascota) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Mascota>(insertMascotaParams);
  const editing = !!mascota?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("mascotas");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: Mascota },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Mascota ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const mascotaParsed = await insertMascotaParams.safeParseAsync({  ...payload });
    if (!mascotaParsed.success) {
      setErrors(mascotaParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = mascotaParsed.data;
    const pendingMascota: Mascota = {
      updatedAt: mascota?.updatedAt ?? new Date(),
      createdAt: mascota?.createdAt ?? new Date(),
      id: mascota?.id ?? "",
      userId: mascota?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingMascota,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateMascotaAction({ ...values, id: mascota.id })
          : await createMascotaAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingMascota 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.nombre ? "text-destructive" : "",
          )}
        >
          Nombre
        </Label>
        <Input
          type="text"
          name="nombre"
          className={cn(errors?.nombre ? "ring ring-destructive" : "")}
          defaultValue={mascota?.nombre ?? ""}
        />
        {errors?.nombre ? (
          <p className="text-xs text-destructive mt-2">{errors.nombre[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.descripcion ? "text-destructive" : "",
          )}
        >
          Descripcion
        </Label>
        <Input
          type="text"
          name="descripcion"
          className={cn(errors?.descripcion ? "ring ring-destructive" : "")}
          defaultValue={mascota?.descripcion ?? ""}
        />
        {errors?.descripcion ? (
          <p className="text-xs text-destructive mt-2">{errors.descripcion[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.edad ? "text-destructive" : "",
          )}
        >
          Edad
        </Label>
        <Input
          type="text"
          name="edad"
          className={cn(errors?.edad ? "ring ring-destructive" : "")}
          defaultValue={mascota?.edad ?? ""}
        />
        {errors?.edad ? (
          <p className="text-xs text-destructive mt-2">{errors.edad[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: mascota });
              const error = await deleteMascotaAction(mascota.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: mascota,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default MascotaForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
