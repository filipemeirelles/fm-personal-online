"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ExerciseActionResult =
  | { ok: true; exerciseId: string }
  | { ok: false; message: string };

export type SimpleActionResult = { ok: true } | { ok: false; message: string };

export interface ExerciseInput {
  name: string;
  muscleGroup?: string | null;
  videoUrl?: string | null;
  description?: string | null;
}

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
      message: "Apenas trainers podem gerenciar a biblioteca de exercícios.",
    };
  }

  return { ok: true as const, supabase, trainerId: user.id };
}

function normalize(input: ExerciseInput) {
  const name = input.name.trim();
  return {
    name,
    muscle_group: input.muscleGroup?.trim() || null,
    video_url: input.videoUrl?.trim() || null,
    description: input.description?.trim() || null,
  };
}

export async function createExercise(
  input: ExerciseInput
): Promise<ExerciseActionResult> {
  const data = normalize(input);
  if (!data.name) {
    return { ok: false, message: "Informe o nome do exercício." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const { data: inserted, error } = await supabase
    .from("exercises")
    .insert({ trainer_id: trainerId, ...data })
    .select("id")
    .single();

  if (error || !inserted) {
    return {
      ok: false,
      message: `Não foi possível salvar o exercício (${error?.message ?? "erro desconhecido"}).`,
    };
  }

  revalidatePath("/trainer/exercicios");
  return { ok: true, exerciseId: inserted.id };
}

export async function updateExercise(
  exerciseId: string,
  input: ExerciseInput
): Promise<ExerciseActionResult> {
  if (!exerciseId) {
    return { ok: false, message: "Exercício inválido." };
  }

  const data = normalize(input);
  if (!data.name) {
    return { ok: false, message: "Informe o nome do exercício." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const { data: updated, error } = await supabase
    .from("exercises")
    .update(data)
    .eq("id", exerciseId)
    .eq("trainer_id", trainerId)
    .select("id")
    .single();

  if (error || !updated) {
    return {
      ok: false,
      message: `Não foi possível atualizar o exercício (${error?.message ?? "exercício não encontrado"}).`,
    };
  }

  revalidatePath("/trainer/exercicios");
  return { ok: true, exerciseId: updated.id };
}

export async function setExerciseActive(
  exerciseId: string,
  isActive: boolean
): Promise<SimpleActionResult> {
  if (!exerciseId) {
    return { ok: false, message: "Exercício inválido." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const { error } = await supabase
    .from("exercises")
    .update({ is_active: isActive })
    .eq("id", exerciseId)
    .eq("trainer_id", trainerId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível atualizar o exercício (${error.message}).`,
    };
  }

  revalidatePath("/trainer/exercicios");
  return { ok: true };
}
