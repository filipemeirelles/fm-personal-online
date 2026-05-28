"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SimpleActionResult = { ok: true } | { ok: false; message: string };

export async function updateSuggestedLoad(
  workoutExerciseId: string,
  load: string
): Promise<SimpleActionResult> {
  if (!workoutExerciseId) {
    return { ok: false, message: "Exercício inválido." };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "Sessão expirada. Entre novamente." };
  }

  // A RLS garante que a aluna só atualiza exercícios dos próprios planos e o
  // trigger no banco bloqueia qualquer alteração além de suggested_load.
  const { error } = await supabase
    .from("workout_exercises")
    .update({ suggested_load: load.trim() || null })
    .eq("id", workoutExerciseId);

  if (error) {
    return {
      ok: false,
      message: `Não foi possível salvar a carga (${error.message}).`,
    };
  }

  revalidatePath("/student/treinos");
  return { ok: true };
}
