"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addDay,
  addExercise,
  deleteDay,
  deleteExercise,
  reorderDays,
  reorderExercises,
  updateDay,
  updateExercise,
  type PrescribedExerciseInput,
} from "./actions";
import { ExerciseForm, type LibraryExercise } from "./exercise-form";

export interface PrescribedExercise {
  id: string;
  exercise_id: string;
  exercise_name: string;
  muscle_group: string | null;
  sets: number;
  reps: string;
  suggested_load: string | null;
  rest: string | null;
  notes: string | null;
}

export interface WorkoutDay {
  id: string;
  name: string;
  focus: string | null;
  exercises: PrescribedExercise[];
}

interface Props {
  planId: string;
  library: LibraryExercise[];
  days: WorkoutDay[];
}

export function PlanEditor({ planId, library, days }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showDayForm, setShowDayForm] = useState(false);
  const [dayName, setDayName] = useState("");
  const [dayFocus, setDayFocus] = useState("");

  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [addingToDayId, setAddingToDayId] = useState<string | null>(null);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  function run(action: () => Promise<{ ok: boolean; message?: string }>) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        setErrorMessage(result.message ?? "Ocorreu um erro.");
        return;
      }
      setShowDayForm(false);
      setEditingDayId(null);
      setAddingToDayId(null);
      setEditingExerciseId(null);
      setDayName("");
      setDayFocus("");
      router.refresh();
    });
  }

  function handleAddDay(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(() => addDay(planId, dayName, dayFocus || null));
  }

  function moveDay(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= days.length) return;
    const ordered = days.map((d) => d.id);
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    run(() => reorderDays(planId, ordered));
  }

  function moveExercise(day: WorkoutDay, index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= day.exercises.length) return;
    const ordered = day.exercises.map((e) => e.id);
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    run(() => reorderExercises(day.id, planId, ordered));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-gray">
          {days.length === 0
            ? "Nenhum treino ainda. Crie o Treino A para começar."
            : `${days.length} treino(s) neste plano.`}
        </p>
        <Button
          size="sm"
          variant={showDayForm ? "ghost" : "primary"}
          onClick={() => setShowDayForm((v) => !v)}
          disabled={isPending}
        >
          {showDayForm ? "Cancelar" : "Novo treino"}
        </Button>
      </div>

      {showDayForm && (
        <form
          onSubmit={handleAddDay}
          className="grid gap-3 rounded-xl border border-brand-beige bg-brand-offwhite p-4 sm:grid-cols-2"
        >
          <div className="space-y-1">
            <Label htmlFor="day-name">Nome do treino</Label>
            <Input
              id="day-name"
              value={dayName}
              onChange={(e) => setDayName(e.target.value)}
              placeholder="Ex: Treino A"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="day-focus">Foco (opcional)</Label>
            <Input
              id="day-focus"
              value={dayFocus}
              onChange={(e) => setDayFocus(e.target.value)}
              placeholder="Ex: Peito e tríceps"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Criando..." : "Criar treino"}
            </Button>
          </div>
        </form>
      )}

      {errorMessage && (
        <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
          {errorMessage}
        </p>
      )}

      <div className="space-y-6">
        {days.map((day, dayIndex) => (
          <div
            key={day.id}
            className="space-y-4 rounded-xl border border-brand-beige bg-white p-5"
          >
            {editingDayId === day.id ? (
              <DayEditForm
                initialName={day.name}
                initialFocus={day.focus ?? ""}
                pending={isPending}
                onCancel={() => setEditingDayId(null)}
                onSubmit={(name, focus) =>
                  run(() => updateDay(day.id, planId, name, focus))
                }
              />
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="font-display text-lg font-medium text-brand-charcoal">
                    {day.name}
                  </h4>
                  {day.focus && (
                    <p className="text-xs text-brand-gray">{day.focus}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveDay(dayIndex, -1)}
                    disabled={isPending || dayIndex === 0}
                    aria-label="Mover treino para cima"
                  >
                    ↑
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveDay(dayIndex, 1)}
                    disabled={isPending || dayIndex === days.length - 1}
                    aria-label="Mover treino para baixo"
                  >
                    ↓
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingDayId(day.id)}
                    disabled={isPending}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-brand-rose hover:bg-brand-rose/10"
                    onClick={() => {
                      if (window.confirm("Excluir este treino e seus exercícios?")) {
                        run(() => deleteDay(day.id, planId));
                      }
                    }}
                    disabled={isPending}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            )}

            {day.exercises.length === 0 ? (
              <p className="text-sm text-brand-gray">
                Nenhum exercício neste treino ainda.
              </p>
            ) : (
              <ul className="divide-y divide-brand-beige">
                {day.exercises.map((ex, exIndex) => (
                  <li key={ex.id} className="py-3">
                    {editingExerciseId === ex.id ? (
                      <ExerciseForm
                        library={library}
                        submitLabel="Salvar exercício"
                        pending={isPending}
                        initial={{
                          exerciseId: ex.exercise_id,
                          sets: ex.sets,
                          reps: ex.reps,
                          suggestedLoad: ex.suggested_load ?? "",
                          rest: ex.rest ?? "",
                          notes: ex.notes ?? "",
                        }}
                        onCancel={() => setEditingExerciseId(null)}
                        onSubmit={(input: PrescribedExerciseInput) =>
                          run(() => updateExercise(ex.id, planId, input))
                        }
                      />
                    ) : (
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-brand-charcoal">
                            {ex.exercise_name}
                          </p>
                          <p className="text-xs text-brand-gray">
                            {ex.sets} séries · {ex.reps} reps
                            {ex.suggested_load
                              ? ` · ${ex.suggested_load}`
                              : ""}
                            {ex.rest ? ` · descanso ${ex.rest}` : ""}
                          </p>
                          {ex.notes && (
                            <p className="text-xs text-brand-gray">
                              Obs.: {ex.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveExercise(day, exIndex, -1)}
                            disabled={isPending || exIndex === 0}
                            aria-label="Mover exercício para cima"
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveExercise(day, exIndex, 1)}
                            disabled={
                              isPending || exIndex === day.exercises.length - 1
                            }
                            aria-label="Mover exercício para baixo"
                          >
                            ↓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingExerciseId(ex.id)}
                            disabled={isPending}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-brand-rose hover:bg-brand-rose/10"
                            onClick={() =>
                              run(() => deleteExercise(ex.id, planId))
                            }
                            disabled={isPending}
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {addingToDayId === day.id ? (
              <ExerciseForm
                library={library}
                submitLabel="Adicionar"
                pending={isPending}
                onCancel={() => setAddingToDayId(null)}
                onSubmit={(input: PrescribedExerciseInput) =>
                  run(() => addExercise(day.id, planId, input))
                }
              />
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAddingToDayId(day.id)}
                disabled={isPending || library.length === 0}
              >
                Adicionar exercício
              </Button>
            )}

            {library.length === 0 && addingToDayId !== day.id && (
              <p className="text-xs text-brand-gray">
                Cadastre exercícios na biblioteca antes de prescrever.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayEditForm({
  initialName,
  initialFocus,
  pending,
  onSubmit,
  onCancel,
}: {
  initialName: string;
  initialFocus: string;
  pending: boolean;
  onSubmit: (name: string, focus: string | null) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [focus, setFocus] = useState(initialFocus);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name, focus || null);
      }}
      className="grid gap-3 sm:grid-cols-2"
    >
      <div className="space-y-1">
        <Label>Nome do treino</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>Foco</Label>
        <Input value={focus} onChange={(e) => setFocus(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 sm:col-span-2">
        <Button type="submit" size="sm" disabled={pending}>
          Salvar
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
