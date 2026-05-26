"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPlan } from "../actions";

interface Props {
  studentId: string;
}

export function NewPlanForm({ studentId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("titulo") ?? "");
    const description = String(formData.get("descricao") ?? "");

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await createPlan(studentId, title, description);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      router.push(`/trainer/alunas/${studentId}/treinos/${result.planId}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="plano-titulo">Título do plano</Label>
        <Input
          id="plano-titulo"
          name="titulo"
          type="text"
          placeholder="Ex: Treino A - Inferiores"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="plano-descricao">Descrição (opcional)</Label>
        <Textarea
          id="plano-descricao"
          name="descricao"
          placeholder="Foco, divisão, observações gerais..."
          rows={4}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar plano"}
        </Button>
      </div>

      {errorMessage && (
        <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
