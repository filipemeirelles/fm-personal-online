"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  recordWorkoutExecution,
  updateWorkoutExecution,
  type ExerciseLogInput,
  type WorkoutLogInput,
} from "./actions";

export interface PlannedExercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  load: string | null;
  rest: string | null;
  notes: string | null;
}

export interface InitialEntry {
  plan_exercise_id: string;
  sets_done: string;
  reps_done: string;
  load_done: string;
  notes: string;
}

interface Props {
  planId: string;
  exercises: PlannedExercise[];
  initialNotes?: string;
  initialEntries?: InitialEntry[];
  logId?: string;
  redirectAfter?: string;
}

function defaultEntry(exercise: PlannedExercise): InitialEntry {
  return {
    plan_exercise_id: exercise.id,
    sets_done: exercise.sets !== null ? String(exercise.sets) : "",
    reps_done: exercise.reps ?? "",
    load_done: exercise.load ?? "",
    notes: "",
  };
}

export function ExecutionForm({
  planId,
  exercises,
  initialNotes = "",
  initialEntries,
  logId,
  redirectAfter,
}: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const entries: ExerciseLogInput[] = exercises.map((exercise) => ({
      plan_exercise_id: exercise.id,
      sets_done: String(formData.get(`${exercise.id}-sets`) ?? ""),
      reps_done: String(formData.get(`${exercise.id}-reps`) ?? ""),
      load_done: String(formData.get(`${exercise.id}-load`) ?? ""),
      notes: String(formData.get(`${exercise.id}-notes`) ?? ""),
    }));

    const payload: WorkoutLogInput = {
      notes: String(formData.get("workout-notes") ?? ""),
      entries,
    };

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = logId
        ? await updateWorkoutExecution(logId, payload)
        : await recordWorkoutExecution(planId, payload);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      router.push(redirectAfter ?? "/student");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  function getInitial(exerciseId: string, key: keyof InitialEntry): string {
    const found = initialEntries?.find((entry) => entry.plan_exercise_id === exerciseId);
    if (!found) {
      const exercise = exercises.find((item) => item.id === exerciseId);
      return exercise ? defaultEntry(exercise)[key] : "";
    }
    const value = found[key];
    return typeof value === "string" ? value : "";
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <ol className="space-y-4">
        {exercises.map((exercise, index) => {
          const planLine = [
            exercise.sets ? `${exercise.sets} séries` : null,
            exercise.reps ? `${exercise.reps} reps` : null,
            exercise.load ? `carga ${exercise.load}` : null,
            exercise.rest ? `descanso ${exercise.rest}` : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li
              key={exercise.id}
              className="rounded-xl border border-brand-beige bg-white p-4"
            >
              <div className="mb-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gray">
                  Exercício {index + 1}
                </p>
                <p className="mt-1 text-sm font-medium text-brand-charcoal">
                  {exercise.name}
                </p>
                {planLine && (
                  <p className="mt-1 text-xs text-brand-gray">{planLine}</p>
                )}
                {exercise.notes && (
                  <p className="mt-1 text-xs italic text-brand-gray">
                    {exercise.notes}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor={`${exercise.id}-sets`}>Séries feitas</Label>
                  <Input
                    id={`${exercise.id}-sets`}
                    name={`${exercise.id}-sets`}
                    type="number"
                    min={0}
                    inputMode="numeric"
                    defaultValue={getInitial(exercise.id, "sets_done")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${exercise.id}-reps`}>Reps feitas</Label>
                  <Input
                    id={`${exercise.id}-reps`}
                    name={`${exercise.id}-reps`}
                    type="text"
                    defaultValue={getInitial(exercise.id, "reps_done")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${exercise.id}-load`}>Carga usada</Label>
                  <Input
                    id={`${exercise.id}-load`}
                    name={`${exercise.id}-load`}
                    type="text"
                    defaultValue={getInitial(exercise.id, "load_done")}
                  />
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <Label htmlFor={`${exercise.id}-notes`}>Observação</Label>
                <Textarea
                  id={`${exercise.id}-notes`}
                  name={`${exercise.id}-notes`}
                  rows={2}
                  placeholder="Como foi a execução?"
                  defaultValue={getInitial(exercise.id, "notes")}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="space-y-2">
        <Label htmlFor="workout-notes">Observações gerais do treino</Label>
        <Textarea
          id="workout-notes"
          name="workout-notes"
          rows={3}
          placeholder="Sensações, energia, ajustes para a próxima vez..."
          defaultValue={initialNotes}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Salvando..."
            : logId
            ? "Salvar alterações"
            : "Concluir treino"}
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
