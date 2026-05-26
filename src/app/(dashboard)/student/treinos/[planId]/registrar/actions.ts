"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ExerciseLogInput {
  plan_exercise_id: string;
  sets_done: string;
  reps_done: string;
  load_done: string;
  notes: string;
}

export interface WorkoutLogInput {
  notes: string;
  entries: ExerciseLogInput[];
}

async function requireStudentSession() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, message: "Sessão expirada. Entre novamente." };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return {
      ok: false as const,
      message: "Não foi possível validar seu perfil.",
    };
  }

  if (profile.role !== "student" || !profile.is_active) {
    return {
      ok: false as const,
      message: "Seu acesso de aluna está suspenso.",
    };
  }

  return { ok: true as const, supabase, studentId: user.id };
}

function parseSets(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
}

function normalizeEntries(entries: ExerciseLogInput[]) {
  return entries
    .map((entry) => ({
      plan_exercise_id: entry.plan_exercise_id,
      sets_done: parseSets(entry.sets_done),
      reps_done: entry.reps_done.trim() || null,
      load_done: entry.load_done.trim() || null,
      notes: entry.notes.trim() || null,
    }))
    .filter(
      (entry) =>
        entry.sets_done !== null ||
        entry.reps_done !== null ||
        entry.load_done !== null ||
        entry.notes !== null
    );
}

export async function recordWorkoutExecution(
  planId: string,
  input: WorkoutLogInput
): Promise<{ ok: true; logId: string } | { ok: false; message: string }> {
  const session = await requireStudentSession();
  if (!session.ok) return session;

  const normalizedEntries = normalizeEntries(input.entries);

  if (normalizedEntries.length === 0) {
    return {
      ok: false,
      message: "Preencha ao menos um exercício para registrar o treino.",
    };
  }

  const { data: plan, error: planError } = await session.supabase
    .from("workout_plans")
    .select("id")
    .eq("id", planId)
    .eq("student_id", session.studentId)
    .single();

  if (planError || !plan) {
    return { ok: false, message: "Plano não encontrado." };
  }

  const now = new Date().toISOString();
  const trimmedNotes = input.notes.trim() || null;

  const { data: log, error: logError } = await session.supabase
    .from("workout_logs")
    .insert({
      plan_id: planId,
      student_id: session.studentId,
      started_at: now,
      completed_at: now,
      notes: trimmedNotes,
    })
    .select("id")
    .single();

  if (logError || !log) {
    return {
      ok: false,
      message: `Não foi possível registrar o treino (${logError?.message ?? "erro desconhecido"}).`,
    };
  }

  const exerciseRows = normalizedEntries.map((entry) => ({
    workout_log_id: log.id,
    plan_exercise_id: entry.plan_exercise_id,
    sets_done: entry.sets_done,
    reps_done: entry.reps_done,
    load_done: entry.load_done,
    notes: entry.notes,
  }));

  const { error: insertError } = await session.supabase
    .from("exercise_logs")
    .insert(exerciseRows);

  if (insertError) {
    await session.supabase.from("workout_logs").delete().eq("id", log.id);
    return {
      ok: false,
      message: `Não foi possível salvar os exercícios (${insertError.message}).`,
    };
  }

  revalidatePath("/student");
  revalidatePath(`/student/treinos/${planId}`);

  return { ok: true, logId: log.id };
}

export async function updateWorkoutExecution(
  logId: string,
  input: WorkoutLogInput
): Promise<{ ok: true } | { ok: false; message: string }> {
  const session = await requireStudentSession();
  if (!session.ok) return session;

  const normalizedEntries = normalizeEntries(input.entries);

  if (normalizedEntries.length === 0) {
    return {
      ok: false,
      message: "Preencha ao menos um exercício para salvar.",
    };
  }

  const { data: existing, error: fetchError } = await session.supabase
    .from("workout_logs")
    .select("id, plan_id, student_id")
    .eq("id", logId)
    .eq("student_id", session.studentId)
    .single();

  if (fetchError || !existing) {
    return { ok: false, message: "Registro não encontrado." };
  }

  const { error: updateError } = await session.supabase
    .from("workout_logs")
    .update({
      notes: input.notes.trim() || null,
      completed_at: new Date().toISOString(),
    })
    .eq("id", logId);

  if (updateError) {
    return {
      ok: false,
      message: `Não foi possível atualizar o registro (${updateError.message}).`,
    };
  }

  const { error: deleteError } = await session.supabase
    .from("exercise_logs")
    .delete()
    .eq("workout_log_id", logId);

  if (deleteError) {
    return {
      ok: false,
      message: `Não foi possível atualizar os exercícios (${deleteError.message}).`,
    };
  }

  const exerciseRows = normalizedEntries.map((entry) => ({
    workout_log_id: logId,
    plan_exercise_id: entry.plan_exercise_id,
    sets_done: entry.sets_done,
    reps_done: entry.reps_done,
    load_done: entry.load_done,
    notes: entry.notes,
  }));

  const { error: insertError } = await session.supabase
    .from("exercise_logs")
    .insert(exerciseRows);

  if (insertError) {
    return {
      ok: false,
      message: `Não foi possível salvar os exercícios (${insertError.message}).`,
    };
  }

  revalidatePath("/student");
  revalidatePath(`/student/treinos/${existing.plan_id}`);
  revalidatePath(`/student/treinos/${existing.plan_id}/historico/${logId}`);

  return { ok: true };
}
