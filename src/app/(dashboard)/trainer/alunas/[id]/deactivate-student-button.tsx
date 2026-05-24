"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deactivateStudent } from "../actions";

interface Props {
  studentId: string;
}

export function DeactivateStudentButton({ studentId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleDeactivate() {
    if (
      !window.confirm(
        "Desativar o acesso desta aluna? Ela não conseguirá mais entrar na área de aluna."
      )
    ) {
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      const result = await deactivateStudent(studentId);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      router.push("/trainer/alunas");
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Button
        className="border-brand-rose text-brand-rose hover:bg-brand-rose/10"
        disabled={isPending}
        onClick={handleDeactivate}
        variant="outline"
      >
        {isPending ? "Desativando..." : "Desativar acesso"}
      </Button>
      {errorMessage && <p className="text-sm text-brand-rose">{errorMessage}</p>}
    </div>
  );
}
