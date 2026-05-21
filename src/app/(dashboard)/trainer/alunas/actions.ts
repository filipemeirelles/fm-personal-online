"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const INVITE_TTL_DAYS = 7;

export type InviteActionResult =
  | { ok: true; inviteId: string; link: string }
  | { ok: false; message: string };

export type SimpleActionResult =
  | { ok: true }
  | { ok: false; message: string };

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ??
    "http://localhost:3000"
  );
}

function buildInviteLink(token: string) {
  return `${getAppUrl()}/convite/${token}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
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
      message: "Apenas trainers podem gerenciar alunas.",
    };
  }

  return { ok: true as const, supabase, trainerId: user.id };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createInvite(
  name: string,
  email: string
): Promise<InviteActionResult> {
  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName || !normalizedEmail) {
    return { ok: false, message: "Informe nome e email da aluna." };
  }

  if (!isValidEmail(normalizedEmail)) {
    return { ok: false, message: "Informe um email válido." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const token = randomUUID();
  const expiresAt = addDays(new Date(), INVITE_TTL_DAYS).toISOString();

  const { data, error } = await supabase
    .from("student_invites")
    .insert({
      trainer_id: trainerId,
      name: trimmedName,
      email: normalizedEmail,
      token,
      expires_at: expiresAt,
    })
    .select("id")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      return {
        ok: false,
        message:
          "Já existe um convite pendente para este email. Reenvie ou cancele o atual.",
      };
    }
    return {
      ok: false,
      message: `Não foi possível criar o convite (${error?.message ?? "erro desconhecido"}).`,
    };
  }

  revalidatePath("/trainer/alunas");

  return { ok: true, inviteId: data.id, link: buildInviteLink(token) };
}

export async function cancelInvite(
  inviteId: string
): Promise<SimpleActionResult> {
  if (!inviteId) {
    return { ok: false, message: "Convite inválido." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const { error } = await supabase
    .from("student_invites")
    .update({ status: "cancelled" })
    .eq("id", inviteId)
    .eq("trainer_id", trainerId)
    .eq("status", "pending");

  if (error) {
    return {
      ok: false,
      message: `Não foi possível cancelar o convite (${error.message}).`,
    };
  }

  revalidatePath("/trainer/alunas");
  return { ok: true };
}

export async function resendInvite(
  inviteId: string
): Promise<InviteActionResult> {
  if (!inviteId) {
    return { ok: false, message: "Convite inválido." };
  }

  const session = await requireTrainerSession();
  if (!session.ok) return session;

  const { supabase, trainerId } = session;

  const expiresAt = addDays(new Date(), INVITE_TTL_DAYS).toISOString();

  const { data, error } = await supabase
    .from("student_invites")
    .update({ expires_at: expiresAt, status: "pending" })
    .eq("id", inviteId)
    .eq("trainer_id", trainerId)
    .in("status", ["pending", "expired"])
    .select("id, token")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message: `Não foi possível reenviar o convite (${error?.message ?? "convite não encontrado"}).`,
    };
  }

  revalidatePath("/trainer/alunas");
  return { ok: true, inviteId: data.id, link: buildInviteLink(data.token) };
}
