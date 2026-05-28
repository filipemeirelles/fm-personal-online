"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SimpleActionResult = { ok: true } | { ok: false; message: string };
export type IdActionResult =
  | { ok: true; id: string }
  | { ok: false; message: string };

async function requireTrainerSession() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, message: "Sessão expirada. Entre novamente." };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !profile || profile.role !== "trainer") {
    return {
      ok: false as const,
      message: "Apenas trainers podem montar treinos.",
    };
  }

  return { ok: true as const, supabase, trainerId: user.id };
}

/** Confirma que o plano pertence ao trainer e devolve o student_id para revalidar. */
async function loadOwnedPlan(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  trainerId: string,
  planId: string
) {
  const { data } = await supabase
    .from("workout_plans")
    .select("id, student_id")
    .eq("id", planId)
    .eq("trainer_id", trainerId)
    .single();
  return data;
}

function revalidatePlan(studentId: string, planId: string) {
  revalidatePath(`/trainer/alunas/${studentId}/planos/${planId}`);
}

// --- Treinos (workout_days) ------------------------------------------------

export async function addDay(
  planId: string,
  name: string,
  focus: string | null
): Promise<IdActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, message: "Informe o nome do treino." };

  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  const { count } = await supabase
    .from("workout_days")
    .select("id", { count: "exact", head: true })
    .eq("workout_plan_id", planId);

  const { data, error } = await supabase
    .from("workout_days")
    .insert({
      workout_plan_id: planId,
      name: trimmed,
      focus: focus?.trim() || null,
      sort_order: count ?? 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: `Não foi possível criar o treino (${error?.message ?? "erro"}).`,
    };
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true, id: data.id };
}

export async function updateDay(
  dayId: string,
  planId: string,
  name: string,
  focus: string | null
): Promise<SimpleActionResult> {
  const trimmed = name.trim();
  if (!trimmed) return { ok: false, message: "Informe o nome do treino." };

  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  const { error } = await supabase
    .from("workout_days")
    .update({ name: trimmed, focus: focus?.trim() || null })
    .eq("id", dayId)
    .eq("workout_plan_id", planId);

  if (error) {
    return { ok: false, message: `Não foi possível salvar (${error.message}).` };
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true };
}

export async function deleteDay(
  dayId: string,
  planId: string
): Promise<SimpleActionResult> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  const { error } = await supabase
    .from("workout_days")
    .delete()
    .eq("id", dayId)
    .eq("workout_plan_id", planId);

  if (error) {
    return { ok: false, message: `Não foi possível excluir (${error.message}).` };
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true };
}

export async function reorderDays(
  planId: string,
  orderedIds: string[]
): Promise<SimpleActionResult> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("workout_days")
      .update({ sort_order: i })
      .eq("id", orderedIds[i])
      .eq("workout_plan_id", planId);
    if (error) {
      return { ok: false, message: `Não foi possível reordenar (${error.message}).` };
    }
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true };
}

// --- Exercícios prescritos (workout_exercises) -----------------------------

export interface PrescribedExerciseInput {
  exerciseId: string;
  sets: number;
  reps: string;
  suggestedLoad?: string | null;
  rest?: string | null;
  notes?: string | null;
}

export async function addExercise(
  dayId: string,
  planId: string,
  input: PrescribedExerciseInput
): Promise<IdActionResult> {
  if (!input.exerciseId) {
    return { ok: false, message: "Selecione um exercício da biblioteca." };
  }
  if (!input.reps) {
    return { ok: false, message: "Selecione a quantidade de repetições." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  const { count } = await supabase
    .from("workout_exercises")
    .select("id", { count: "exact", head: true })
    .eq("workout_day_id", dayId);

  const { data, error } = await supabase
    .from("workout_exercises")
    .insert({
      workout_day_id: dayId,
      exercise_id: input.exerciseId,
      sets: input.sets,
      reps: input.reps,
      suggested_load: input.suggestedLoad?.trim() || null,
      rest: input.rest || null,
      notes: input.notes?.trim() || null,
      sort_order: count ?? 0,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: `Não foi possível adicionar o exercício (${error?.message ?? "erro"}).`,
    };
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true, id: data.id };
}

export async function updateExercise(
  workoutExerciseId: string,
  planId: string,
  input: PrescribedExerciseInput
): Promise<SimpleActionResult> {
  if (!input.reps) {
    return { ok: false, message: "Selecione a quantidade de repetições." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  const { error } = await supabase
    .from("workout_exercises")
    .update({
      exercise_id: input.exerciseId,
      sets: input.sets,
      reps: input.reps,
      suggested_load: input.suggestedLoad?.trim() || null,
      rest: input.rest || null,
      notes: input.notes?.trim() || null,
    })
    .eq("id", workoutExerciseId);

  if (error) {
    return { ok: false, message: `Não foi possível salvar (${error.message}).` };
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true };
}

export async function reorderExercises(
  dayId: string,
  planId: string,
  orderedIds: string[]
): Promise<SimpleActionResult> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("workout_exercises")
      .update({ sort_order: i })
      .eq("id", orderedIds[i])
      .eq("workout_day_id", dayId);
    if (error) {
      return { ok: false, message: `Não foi possível reordenar (${error.message}).` };
    }
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true };
}

export async function deleteExercise(
  workoutExerciseId: string,
  planId: string
): Promise<SimpleActionResult> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;
  const { supabase, trainerId } = session;

  const plan = await loadOwnedPlan(supabase, trainerId, planId);
  if (!plan) return { ok: false, message: "Plano não encontrado." };

  const { error } = await supabase
    .from("workout_exercises")
    .delete()
    .eq("id", workoutExerciseId);

  if (error) {
    return { ok: false, message: `Não foi possível excluir (${error.message}).` };
  }

  revalidatePlan(plan.student_id, planId);
  return { ok: true };
}
