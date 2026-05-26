"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addExercise, type ExerciseInput } from "../actions";

interface Props {
  planId: string;
}

const EMPTY: ExerciseInput = {
  name: "",
  sets: "",
  reps: "",
  load: "",
  rest: "",
  notes: "",
  video_url: "",
};

export function ExerciseForm({ planId }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const input: ExerciseInput = {
      name: String(formData.get("nome") ?? ""),
      sets: String(formData.get("sets") ?? ""),
      reps: String(formData.get("reps") ?? ""),
      load: String(formData.get("load") ?? ""),
      rest: String(formData.get("rest") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      video_url: String(formData.get("video_url") ?? ""),
    };

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await addExercise(planId, input);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setFormKey((value) => value + 1);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form key={formKey} className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`ex-nome-${formKey}`}>Nome do exercício</Label>
          <Input
            id={`ex-nome-${formKey}`}
            name="nome"
            type="text"
            placeholder="Ex: Agachamento livre"
            defaultValue={EMPTY.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`ex-sets-${formKey}`}>Séries</Label>
          <Input
            id={`ex-sets-${formKey}`}
            name="sets"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Ex: 4"
            defaultValue={EMPTY.sets}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`ex-reps-${formKey}`}>Repetições</Label>
          <Input
            id={`ex-reps-${formKey}`}
            name="reps"
            type="text"
            placeholder="Ex: 8-12"
            defaultValue={EMPTY.reps}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`ex-load-${formKey}`}>Carga sugerida</Label>
          <Input
            id={`ex-load-${formKey}`}
            name="load"
            type="text"
            placeholder="Ex: 30kg"
            defaultValue={EMPTY.load}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`ex-rest-${formKey}`}>Descanso</Label>
          <Input
            id={`ex-rest-${formKey}`}
            name="rest"
            type="text"
            placeholder="Ex: 60s ou 1 min"
            defaultValue={EMPTY.rest}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`ex-video-${formKey}`}>Link de vídeo (opcional)</Label>
          <Input
            id={`ex-video-${formKey}`}
            name="video_url"
            type="url"
            placeholder="https://youtube.com/..."
            defaultValue={EMPTY.video_url}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`ex-notes-${formKey}`}>Observações (opcional)</Label>
          <Textarea
            id={`ex-notes-${formKey}`}
            name="notes"
            placeholder="Execução, técnica, foco..."
            defaultValue={EMPTY.notes}
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adicionando..." : "Adicionar exercício"}
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
