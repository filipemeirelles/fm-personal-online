"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptInvite } from "./actions";

interface Props {
  token: string;
  name: string;
  email: string;
}

export function AcceptInviteForm({ token, name, email }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("senha") ?? "");

    try {
      const result = await acceptInvite(token, password);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="invite-nome">Nome</Label>
        <Input
          id="invite-nome"
          name="nome"
          type="text"
          value={name}
          readOnly
          aria-readonly
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-email">Email</Label>
        <Input
          id="invite-email"
          name="email"
          type="email"
          value={email}
          readOnly
          aria-readonly
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-senha">Crie uma senha</Label>
        <Input
          id="invite-senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          placeholder="Pelo menos 6 caracteres"
          minLength={6}
          required
        />
      </div>

      {errorMessage && (
        <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
          {errorMessage}
        </p>
      )}

      <Button className="w-full" disabled={isSubmitting} size="lg" type="submit">
        {isSubmitting ? "Criando seu acesso..." : "Confirmar e entrar"}
      </Button>
    </form>
  );
}
