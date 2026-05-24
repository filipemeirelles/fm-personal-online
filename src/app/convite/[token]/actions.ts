"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AcceptInviteResult =
  | { ok: true; redirectTo: string }
  | { ok: false; message: string };

export async function acceptInvite(
  token: string,
  password: string
): Promise<AcceptInviteResult> {
  if (!token) {
    return { ok: false, message: "Convite inválido." };
  }

  if (!password || password.length < 6) {
    return {
      ok: false,
      message: "A senha precisa ter pelo menos 6 caracteres.",
    };
  }

  const admin = createSupabaseAdminClient();

  const { data: invites, error: lookupError } = await admin.rpc(
    "get_invite_by_token",
    { invite_token: token }
  );

  if (lookupError) {
    return {
      ok: false,
      message: `Não foi possível validar o convite (${lookupError.message}).`,
    };
  }

  const invite = invites?.[0];

  if (!invite) {
    return { ok: false, message: "Convite não encontrado." };
  }

  if (invite.status === "expired") {
    return {
      ok: false,
      message: "Este convite expirou. Peça um novo ao seu personal.",
    };
  }

  if (invite.status === "cancelled") {
    return {
      ok: false,
      message: "Este convite foi cancelado pelo seu personal.",
    };
  }

  if (invite.status === "accepted") {
    return {
      ok: false,
      message: "Este convite já foi aceito. Faça login com seu email.",
    };
  }

  const { data: created, error: createUserError } =
    await admin.auth.admin.createUser({
      email: invite.email,
      password,
      email_confirm: true,
      user_metadata: {
        name: invite.name,
        role: "student",
        trainer_id: invite.trainer_id,
      },
    });

  if (createUserError || !created.user) {
    const message = createUserError?.message ?? "erro desconhecido";
    if (message.toLowerCase().includes("already registered")) {
      return {
        ok: false,
        message:
          "Já existe uma conta com este email. Entre por /login ou avise seu personal.",
      };
    }
    return {
      ok: false,
      message: `Não foi possível criar sua conta (${message}).`,
    };
  }

  // O trigger handle_new_user_profile ja inseriu o profile com role/trainer_id.
  // Garantimos consistencia caso o trigger falhe em algum cenario.
  const { error: profileError } = await admin
    .from("profiles")
    .update({
      name: invite.name,
      role: "student",
      trainer_id: invite.trainer_id,
      is_active: true,
    })
    .eq("id", created.user.id);

  if (profileError) {
    return {
      ok: false,
      message: `Sua conta foi criada mas o perfil não pôde ser configurado (${profileError.message}).`,
    };
  }

  const { error: inviteUpdateError } = await admin
    .from("student_invites")
    .update({
      status: "accepted",
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  if (inviteUpdateError) {
    return {
      ok: false,
      message: `Sua conta foi criada mas não conseguimos finalizar o convite (${inviteUpdateError.message}).`,
    };
  }

  // Autentica a aluna no contexto do navegador via cookies.
  const sessionClient = await createSupabaseServerClient();
  const { error: signInError } = await sessionClient.auth.signInWithPassword({
    email: invite.email,
    password,
  });

  if (signInError) {
    return {
      ok: false,
      message:
        "Sua conta foi criada, mas não conseguimos autenticar você agora. Tente entrar em /login.",
    };
  }

  return { ok: true, redirectTo: "/student" };
}
