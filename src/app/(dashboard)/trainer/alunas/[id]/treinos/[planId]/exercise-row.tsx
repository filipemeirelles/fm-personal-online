"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteExercise,
  moveExercise,
  updateExercise,
  type ExerciseInput,
} from "../actions";

interface Exercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  load: string | null;
  rest: string | null;
  notes: string | null;
  video_url: string | null;
  order_index: number;
}

interface Props {
  exercise: Exercise;
  isFirst: boolean;
  isLast: boolean;
}

export function ExerciseRow({ exercise, isFirst, isLast }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      const result = await updateExercise(exercise.id, input);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      setIsEditing(false);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDelete() {
    if (!window.confirm("Remover este exercício do plano?")) return;
    setErrorMessage(null);
    startTransition(async () => {
      const result = await deleteExercise(exercise.id);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleMove(direction: "up" | "down") {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await moveExercise(exercise.id, direction);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  if (isEditing) {
    return (
      <form
        className="rounded-lg border border-brand-rose/50 bg-brand-rose/5 p-4 space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`edit-nome-${exercise.id}`}>Nome do exercício</Label>
            <Input
              id={`edit-nome-${exercise.id}`}
              name="nome"
              type="text"
              defaultValue={exercise.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-sets-${exercise.id}`}>Séries</Label>
            <Input
              id={`edit-sets-${exercise.id}`}
              name="sets"
              type="number"
              min={0}
              inputMode="numeric"
              defaultValue={exercise.sets ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-reps-${exercise.id}`}>Repetições</Label>
            <Input
              id={`edit-reps-${exercise.id}`}
              name="reps"
              type="text"
              defaultValue={exercise.reps ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-load-${exercise.id}`}>Carga sugerida</Label>
            <Input
              id={`edit-load-${exercise.id}`}
              name="load"
              type="text"
              defaultValue={exercise.load ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-rest-${exercise.id}`}>Descanso</Label>
            <Input
              id={`edit-rest-${exercise.id}`}
              name="rest"
              type="text"
              defaultValue={exercise.rest ?? ""}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`edit-video-${exercise.id}`}>Link de vídeo</Label>
            <Input
              id={`edit-video-${exercise.id}`}
              name="video_url"
              type="url"
              defaultValue={exercise.video_url ?? ""}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`edit-notes-${exercise.id}`}>Observações</Label>
            <Textarea
              id={`edit-notes-${exercise.id}`}
              name="notes"
              defaultValue={exercise.notes ?? ""}
              rows={3}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => setIsEditing(false)}
          >
            Cancelar
          </Button>
        </div>

        {errorMessage && (
          <p className="text-xs text-brand-rose">{errorMessage}</p>
        )}
      </form>
    );
  }

  const metaLine = [
    exercise.sets ? `${exercise.sets} séries` : null,
    exercise.reps ? `${exercise.reps} reps` : null,
    exercise.load ? `carga ${exercise.load}` : null,
    exercise.rest ? `descanso ${exercise.rest}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-lg border border-brand-beige bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-brand-charcoal">{exercise.name}</p>
          {metaLine && <p className="text-xs text-brand-gray">{metaLine}</p>}
          {exercise.notes && (
            <p className="text-xs text-brand-gray italic">{exercise.notes}</p>
          )}
          {exercise.video_url && (
            <a
              href={exercise.video_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-2 hover:text-brand-rose"
            >
              Ver vídeo
            </a>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={isFirst || isPending}
            onClick={() => handleMove("up")}
            aria-label="Mover para cima"
          >
            ↑
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={isLast || isPending}
            onClick={() => handleMove("down")}
            aria-label="Mover para baixo"
          >
            ↓
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={isPending}
            onClick={handleDelete}
          >
            Remover
          </Button>
        </div>
      </div>

      {errorMessage && (
        <p className="mt-2 text-xs text-brand-rose">{errorMessage}</p>
      )}
    </div>
  );
}
