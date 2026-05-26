"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { deletePlan, setPlanActive } from "../actions";

interface Props {
  planId: string;
  studentId: string;
  isActive: boolean;
}

export function PlanActions({ planId, studentId, isActive }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleToggle() {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await setPlanActive(planId, !isActive);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Excluir este plano? Os exercícios também serão removidos. Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setErrorMessage(null);
    startTransition(async () => {
      const result = await deletePlan(planId);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.push(`/trainer/alunas/${studentId}/treinos`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleToggle} disabled={isPending}>
          {isActive ? "Desativar plano" : "Ativar plano"}
        </Button>
        <Button variant="outline" onClick={handleDelete} disabled={isPending}>
          {isPending ? "Processando..." : "Excluir plano"}
        </Button>
      </div>
      {errorMessage && <p className="text-sm text-brand-rose">{errorMessage}</p>}
    </div>
  );
}
