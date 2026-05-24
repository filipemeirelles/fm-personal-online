"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInvite } from "./actions";

export function InviteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setErrorMessage(null);
    setLink(null);
    setLinkCopied(false);
    setIsSubmitting(true);

    const formData = new FormData(form);
    const name = String(formData.get("nome") ?? "");
    const email = String(formData.get("email") ?? "");

    try {
      const result = await createInvite(name, email);

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setLink(result.link);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkCopied(false);
    }
  }

  return (
    <div className="space-y-4">
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="invite-nome">Nome completo</Label>
          <Input
            id="invite-nome"
            name="nome"
            type="text"
            autoComplete="name"
            placeholder="Nome da aluna"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-email">Email</Label>
          <Input
            id="invite-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="aluna@exemplo.com"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Gerando convite..." : "Gerar convite"}
          </Button>
        </div>
      </form>

      {errorMessage && (
        <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
          {errorMessage}
        </p>
      )}

      {link && (
        <div className="space-y-2 rounded-lg border border-brand-beige bg-brand-offwhite px-4 py-3">
          <p className="text-sm font-medium text-brand-charcoal">
            Convite criado. Envie este link para a aluna:
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <code className="block flex-1 truncate rounded-md bg-white px-3 py-2 text-xs text-brand-charcoal">
              {link}
            </code>
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {linkCopied ? "Copiado!" : "Copiar link"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
