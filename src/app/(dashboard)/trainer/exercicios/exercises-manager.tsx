"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MUSCLE_GROUPS } from "@/lib/workout/options";
import {
  createExercise,
  setExerciseActive,
  updateExercise,
  type ExerciseInput,
} from "./actions";

export interface ExerciseRow {
  id: string;
  name: string;
  muscle_group: string | null;
  video_url: string | null;
  description: string | null;
  is_active: boolean;
}

interface Props {
  exercises: ExerciseRow[];
}

const emptyForm: ExerciseInput = {
  name: "",
  muscleGroup: "",
  videoUrl: "",
  description: "",
};

export function ExercisesManager({ exercises }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExerciseInput>(emptyForm);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const grouped = useMemo(() => {
    const visible = exercises.filter((e) => showInactive || e.is_active);
    const map = new Map<string, ExerciseRow[]>();
    for (const ex of visible) {
      const key = ex.muscle_group || "Sem grupo";
      const list = map.get(key) ?? [];
      list.push(ex);
      map.set(key, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [exercises, showInactive]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setErrorMessage(null);
  }

  function startEdit(ex: ExerciseRow) {
    setEditingId(ex.id);
    setErrorMessage(null);
    setForm({
      name: ex.name,
      muscleGroup: ex.muscle_group ?? "",
      videoUrl: ex.video_url ?? "",
      description: ex.description ?? "",
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = editingId
        ? await updateExercise(editingId, form)
        : await createExercise(form);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      resetForm();
      router.refresh();
    });
  }

  function handleToggleActive(ex: ExerciseRow) {
    startTransition(async () => {
      const result = await setExerciseActive(ex.id, !ex.is_active);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit}
        id="exercise-form"
      >
        <div className="space-y-2">
          <Label htmlFor="ex-name">Nome do exercício</Label>
          <Input
            id="ex-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex: Supino reto"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ex-muscle">Grupo muscular</Label>
          <Select
            id="ex-muscle"
            value={form.muscleGroup ?? ""}
            onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })}
          >
            <option value="">Selecione</option>
            {MUSCLE_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ex-video">Vídeo / GIF (URL)</Label>
          <Input
            id="ex-video"
            type="url"
            value={form.videoUrl ?? ""}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ex-desc">Descrição / instruções</Label>
          <Input
            id="ex-desc"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Observações de execução"
          />
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Salvando..."
              : editingId
                ? "Salvar alterações"
                : "Adicionar exercício"}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancelar edição
            </Button>
          )}
        </div>
      </form>

      {errorMessage && (
        <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
          {errorMessage}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-brand-gray">
          Biblioteca
        </p>
        <label className="flex items-center gap-2 text-xs text-brand-gray">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
          />
          Mostrar desativados
        </label>
      </div>

      {grouped.length === 0 ? (
        <p className="text-sm text-brand-gray">
          Nenhum exercício cadastrado ainda. Adicione o primeiro acima.
        </p>
      ) : (
        <div className="space-y-6">
          {grouped.map(([group, items]) => (
            <div key={group} className="space-y-3">
              <h4 className="font-display text-base font-medium text-brand-charcoal">
                {group}
              </h4>
              <ul className="divide-y divide-brand-beige">
                {items.map((ex) => (
                  <li
                    key={ex.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-brand-charcoal">
                          {ex.name}
                        </p>
                        {!ex.is_active && (
                          <Badge variant="neutral">Desativado</Badge>
                        )}
                      </div>
                      {ex.description && (
                        <p className="text-xs text-brand-gray">
                          {ex.description}
                        </p>
                      )}
                      {ex.video_url && (
                        <a
                          href={ex.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                        >
                          Ver vídeo
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(ex)}
                        disabled={isPending}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(ex)}
                        disabled={isPending}
                      >
                        {ex.is_active ? "Desativar" : "Reativar"}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
