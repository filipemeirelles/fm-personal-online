"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActionResult<T = undefined> =
  | (T extends undefined ? { ok: true } : { ok: true } & T)
  | { ok: false; message: string };

export interface ExerciseInput {
  name: string;
  sets: string;
  reps: string;
  load: string;
  rest: string;
  notes: string;
  video_url: string;
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

  if (error || !profile) {
    return {
      ok: false as const,
      message: "Não foi possível validar seu perfil de trainer.",
    };
  }

  if (profile.role !== "trainer") {
    return {
      ok: false as const,
      message: "Apenas trainers podem gerenciar planos de treino.",
    };
  }

  return { ok: true as const, supabase, trainerId: user.id };
}

async function ensurePlanOwnership(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  trainerId: string,
  planId: string
) {
  const { data: plan, error } = await supabase
    .from("workout_plans")
    .select("id, student_id, trainer_id")
    .eq("id", planId)
    .eq("trainer_id", trainerId)
    .single();

  if (error || !plan) {
    return { ok: false as const, message: "Plano não encontrado." };
  }

  return { ok: true as const, plan };
}

async function ensureStudentOwnership(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  trainerId: string,
  studentId: string
) {
  const { data: student, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", studentId)
    .eq("trainer_id", trainerId)
    .eq("role", "student")
    .single();

  if (error || !student) {
    return { ok: false as const, message: "Aluna não encontrada." };
  }

  return { ok: true as const };
}

export async function createPlan(
  studentId: string,
  title: string,
  description: string
): Promise<{ ok: true; planId: string } | { ok: false; message: string }> {
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle) {
    return { ok: false, message: "Informe um título para o plano." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const ownership = await ensureStudentOwnership(
    session.supabase,
    session.trainerId,
    studentId
  );
  if (!ownership.ok) return ownership;

  const { data, error } = await session.supabase
    .from("workout_plans")
    .insert({
      trainer_id: session.trainerId,
      student_id: studentId,
      title: trimmedTitle,
      description: trimmedDescription || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: `Não foi possível criar o plano (${error?.message ?? "erro desconhecido"}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${studentId}/treinos`);
  revalidatePath(`/trainer/alunas/${studentId}`);

  return { ok: true, planId: data.id };
}

export async function updatePlanMetadata(
  planId: string,
  title: string,
  description: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return { ok: false, message: "Informe um título para o plano." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const ownership = await ensurePlanOwnership(
    session.supabase,
    session.trainerId,
    planId
  );
  if (!ownership.ok) return ownership;

  const { error } = await session.supabase
    .from("workout_plans")
    .update({
      title: trimmedTitle,
      description: description.trim() || null,
    })
    .eq("id", planId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível atualizar o plano (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}/treinos`);
  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}/treinos/${planId}`);

  return { ok: true };
}

export async function setPlanActive(
  planId: string,
  isActive: boolean
): Promise<{ ok: true } | { ok: false; message: string }> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const ownership = await ensurePlanOwnership(
    session.supabase,
    session.trainerId,
    planId
  );
  if (!ownership.ok) return ownership;

  const { error } = await session.supabase
    .from("workout_plans")
    .update({ is_active: isActive })
    .eq("id", planId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível alterar o status do plano (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}/treinos`);
  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}/treinos/${planId}`);
  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}`);

  return { ok: true };
}

export async function deletePlan(
  planId: string
): Promise<{ ok: true; studentId: string } | { ok: false; message: string }> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const ownership = await ensurePlanOwnership(
    session.supabase,
    session.trainerId,
    planId
  );
  if (!ownership.ok) return ownership;

  const { error } = await session.supabase
    .from("workout_plans")
    .delete()
    .eq("id", planId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível excluir o plano (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}/treinos`);
  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}`);

  return { ok: true, studentId: ownership.plan.student_id };
}

function parseSets(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
}

function normalizeExerciseInput(input: ExerciseInput) {
  return {
    name: input.name.trim(),
    sets: parseSets(input.sets),
    reps: input.reps.trim() || null,
    load: input.load.trim() || null,
    rest: input.rest.trim() || null,
    notes: input.notes.trim() || null,
    video_url: input.video_url.trim() || null,
  };
}

export async function addExercise(
  planId: string,
  input: ExerciseInput
): Promise<{ ok: true } | { ok: false; message: string }> {
  const normalized = normalizeExerciseInput(input);

  if (!normalized.name) {
    return { ok: false, message: "Informe o nome do exercício." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const ownership = await ensurePlanOwnership(
    session.supabase,
    session.trainerId,
    planId
  );
  if (!ownership.ok) return ownership;

  const { data: maxOrder } = await session.supabase
    .from("plan_exercises")
    .select("order_index")
    .eq("plan_id", planId)
    .order("order_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxOrder?.order_index ?? -1) + 1;

  const { error } = await session.supabase.from("plan_exercises").insert({
    plan_id: planId,
    name: normalized.name,
    sets: normalized.sets,
    reps: normalized.reps,
    load: normalized.load,
    rest: normalized.rest,
    notes: normalized.notes,
    video_url: normalized.video_url,
    order_index: nextOrder,
  });

  if (error) {
    return {
      ok: false,
      message: `Não foi possível adicionar o exercício (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${ownership.plan.student_id}/treinos/${planId}`);

  return { ok: true };
}

export async function updateExercise(
  exerciseId: string,
  input: ExerciseInput
): Promise<{ ok: true } | { ok: false; message: string }> {
  const normalized = normalizeExerciseInput(input);

  if (!normalized.name) {
    return { ok: false, message: "Informe o nome do exercício." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { data: existing, error: fetchError } = await session.supabase
    .from("plan_exercises")
    .select("id, plan_id, workout_plans!inner(trainer_id, student_id)")
    .eq("id", exerciseId)
    .single();

  if (fetchError || !existing) {
    return { ok: false, message: "Exercício não encontrado." };
  }

  const plan = Array.isArray(existing.workout_plans)
    ? existing.workout_plans[0]
    : existing.workout_plans;

  if (!plan || plan.trainer_id !== session.trainerId) {
    return { ok: false, message: "Exercício não pertence a você." };
  }

  const { error } = await session.supabase
    .from("plan_exercises")
    .update({
      name: normalized.name,
      sets: normalized.sets,
      reps: normalized.reps,
      load: normalized.load,
      rest: normalized.rest,
      notes: normalized.notes,
      video_url: normalized.video_url,
    })
    .eq("id", exerciseId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível atualizar o exercício (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${plan.student_id}/treinos/${existing.plan_id}`);

  return { ok: true };
}

export async function deleteExercise(
  exerciseId: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { data: existing, error: fetchError } = await session.supabase
    .from("plan_exercises")
    .select("id, plan_id, workout_plans!inner(trainer_id, student_id)")
    .eq("id", exerciseId)
    .single();

  if (fetchError || !existing) {
    return { ok: false, message: "Exercício não encontrado." };
  }

  const plan = Array.isArray(existing.workout_plans)
    ? existing.workout_plans[0]
    : existing.workout_plans;

  if (!plan || plan.trainer_id !== session.trainerId) {
    return { ok: false, message: "Exercício não pertence a você." };
  }

  const { error } = await session.supabase
    .from("plan_exercises")
    .delete()
    .eq("id", exerciseId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível remover o exercício (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${plan.student_id}/treinos/${existing.plan_id}`);

  return { ok: true };
}

export async function moveExercise(
  exerciseId: string,
  direction: "up" | "down"
): Promise<{ ok: true } | { ok: false; message: string }> {
  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { data: existing, error: fetchError } = await session.supabase
    .from("plan_exercises")
    .select("id, plan_id, order_index, workout_plans!inner(trainer_id, student_id)")
    .eq("id", exerciseId)
    .single();

  if (fetchError || !existing) {
    return { ok: false, message: "Exercício não encontrado." };
  }

  const plan = Array.isArray(existing.workout_plans)
    ? existing.workout_plans[0]
    : existing.workout_plans;

  if (!plan || plan.trainer_id !== session.trainerId) {
    return { ok: false, message: "Exercício não pertence a você." };
  }

  const neighborQuery = session.supabase
    .from("plan_exercises")
    .select("id, order_index")
    .eq("plan_id", existing.plan_id);

  const { data: target } =
    direction === "down"
      ? await neighborQuery
          .gt("order_index", existing.order_index)
          .order("order_index", { ascending: true })
          .limit(1)
          .maybeSingle()
      : await neighborQuery
          .lt("order_index", existing.order_index)
          .order("order_index", { ascending: false })
          .limit(1)
          .maybeSingle();

  if (!target) {
    return { ok: true };
  }

  const updates = await Promise.all([
    session.supabase
      .from("plan_exercises")
      .update({ order_index: target.order_index })
      .eq("id", existing.id),
    session.supabase
      .from("plan_exercises")
      .update({ order_index: existing.order_index })
      .eq("id", target.id),
  ]);

  const failed = updates.find((result) => result.error);
  if (failed?.error) {
    return {
      ok: false,
      message: `Não foi possível reordenar (${failed.error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${plan.student_id}/treinos/${existing.plan_id}`);

  return { ok: true };
}
