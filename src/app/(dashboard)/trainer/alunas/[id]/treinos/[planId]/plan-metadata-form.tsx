"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePlanMetadata } from "../actions";

interface Props {
  planId: string;
  initialTitle: string;
  initialDescription: string;
}

export function PlanMetadataForm({
  planId,
  initialTitle,
  initialDescription,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("titulo") ?? "");
    const description = String(formData.get("descricao") ?? "");

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await updatePlanMetadata(planId, title, description);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setSuccessMessage("Plano atualizado.");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="meta-titulo">Título</Label>
        <Input
          id="meta-titulo"
          name="titulo"
          type="text"
          defaultValue={initialTitle}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="meta-descricao">Descrição</Label>
        <Textarea
          id="meta-descricao"
          name="descricao"
          defaultValue={initialDescription}
          rows={3}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
        {successMessage && (
          <span className="text-xs text-brand-charcoal">{successMessage}</span>
        )}
      </div>

      {errorMessage && (
        <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
