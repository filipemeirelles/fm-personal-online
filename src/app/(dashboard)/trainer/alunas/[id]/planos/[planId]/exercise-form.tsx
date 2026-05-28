"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  DEFAULT_REPS,
  DEFAULT_REST,
  DEFAULT_SETS,
  REPS_OPTIONS,
  REST_OPTIONS,
} from "@/lib/workout/options";
import type { PrescribedExerciseInput } from "./actions";

export interface LibraryExercise {
  id: string;
  name: string;
  muscle_group: string | null;
}

interface Props {
  library: LibraryExercise[];
  initial?: Partial<PrescribedExerciseInput>;
  submitLabel: string;
  pending: boolean;
  onSubmit: (input: PrescribedExerciseInput) => void;
  onCancel?: () => void;
}

export function ExerciseForm({
  library,
  initial,
  submitLabel,
  pending,
  onSubmit,
  onCancel,
}: Props) {
  const [exerciseId, setExerciseId] = useState(initial?.exerciseId ?? "");
  const [sets, setSets] = useState(String(initial?.sets ?? DEFAULT_SETS));
  const [reps, setReps] = useState(initial?.reps ?? DEFAULT_REPS);
  const [suggestedLoad, setSuggestedLoad] = useState(
    initial?.suggestedLoad ?? ""
  );
  const [rest, setRest] = useState(initial?.rest ?? DEFAULT_REST);
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      exerciseId,
      sets: Number(sets) || DEFAULT_SETS,
      reps,
      suggestedLoad,
      rest,
      notes,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-lg border border-brand-beige bg-white p-4 sm:grid-cols-2"
    >
      <div className="space-y-1 sm:col-span-2">
        <Label>Exercício</Label>
        <Select
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
          required
        >
          <option value="">Selecione da biblioteca</option>
          {library.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.muscle_group ? `${ex.muscle_group} — ${ex.name}` : ex.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Séries</Label>
        <Input
          type="number"
          min={1}
          max={20}
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label>Repetições</Label>
        <Select value={reps} onChange={(e) => setReps(e.target.value)}>
          {REPS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1">
        <Label>Carga sugerida</Label>
        <Input
          value={suggestedLoad ?? ""}
          onChange={(e) => setSuggestedLoad(e.target.value)}
          placeholder="Ex: 20kg"
        />
      </div>

      <div className="space-y-1">
        <Label>Descanso</Label>
        <Select value={rest ?? ""} onChange={(e) => setRest(e.target.value)}>
          {REST_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-1 sm:col-span-2">
        <Label>Observações</Label>
        <Input
          value={notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Cadência, técnica, dicas..."
        />
      </div>

      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Salvando..." : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
