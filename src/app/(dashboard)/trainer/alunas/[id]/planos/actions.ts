"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PlanActionResult =
  | { ok: true; planId: string }
  | { ok: false; message: string };

export type SimpleActionResult = { ok: true } | { ok: false; message: string };

export interface PlanInput {
  studentId: string;
  name: string;
  description?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
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
      message: "Apenas trainers podem gerenciar planos.",
    };
  }

  return { ok: true as const, supabase, trainerId: user.id };
}

async function assertOwnsStudent(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  trainerId: string,
  studentId: string
) {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", studentId)
    .eq("trainer_id", trainerId)
    .eq("role", "student")
    .single();

  return Boolean(data);
}

export async function createPlan(input: PlanInput): Promise<PlanActionResult> {
  const name = input.name.trim();
  if (!name) {
    return { ok: false, message: "Informe o nome do plano." };
  }
  if (!input.studentId) {
    return { ok: false, message: "Aluna inválida." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  if (!(await assertOwnsStudent(supabase, trainerId, input.studentId))) {
    return { ok: false, message: "Aluna não encontrada na sua consultoria." };
  }

  // Garante um único plano ativo por aluna: desativa o anterior antes de inserir.
  await supabase
    .from("workout_plans")
    .update({ is_active: false })
    .eq("student_id", input.studentId)
    .eq("trainer_id", trainerId)
    .eq("is_active", true);

  const { data, error } = await supabase
    .from("workout_plans")
    .insert({
      trainer_id: trainerId,
      student_id: input.studentId,
      name,
      description: input.description?.trim() || null,
      starts_at: input.startsAt || null,
      ends_at: input.endsAt || null,
      is_active: true,
    })
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: `Não foi possível criar o plano (${error?.message ?? "erro desconhecido"}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${input.studentId}`);
  return { ok: true, planId: data.id };
}

export async function activatePlan(
  planId: string
): Promise<SimpleActionResult> {
  if (!planId) {
    return { ok: false, message: "Plano inválido." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("id, student_id")
    .eq("id", planId)
    .eq("trainer_id", trainerId)
    .single();

  if (!plan) {
    return { ok: false, message: "Plano não encontrado." };
  }

  await supabase
    .from("workout_plans")
    .update({ is_active: false })
    .eq("student_id", plan.student_id)
    .eq("trainer_id", trainerId)
    .eq("is_active", true);

  const { error } = await supabase
    .from("workout_plans")
    .update({ is_active: true })
    .eq("id", planId)
    .eq("trainer_id", trainerId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível ativar o plano (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${plan.student_id}`);
  return { ok: true };
}

export async function deactivatePlan(
  planId: string
): Promise<SimpleActionResult> {
  if (!planId) {
    return { ok: false, message: "Plano inválido." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const { data: plan, error } = await supabase
    .from("workout_plans")
    .update({ is_active: false })
    .eq("id", planId)
    .eq("trainer_id", trainerId)
    .select("student_id")
    .single();

  if (error || !plan) {
    return {
      ok: false,
      message: `Não foi possível desativar o plano (${error?.message ?? "plano não encontrado"}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${plan.student_id}`);
  return { ok: true };
}

export async function deletePlan(planId: string): Promise<SimpleActionResult> {
  if (!planId) {
    return { ok: false, message: "Plano inválido." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("student_id")
    .eq("id", planId)
    .eq("trainer_id", trainerId)
    .single();

  if (!plan) {
    return { ok: false, message: "Plano não encontrado." };
  }

  const { error } = await supabase
    .from("workout_plans")
    .delete()
    .eq("id", planId)
    .eq("trainer_id", trainerId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível excluir o plano (${error.message}).`,
    };
  }

  revalidatePath(`/trainer/alunas/${plan.student_id}`);
  return { ok: true };
}
