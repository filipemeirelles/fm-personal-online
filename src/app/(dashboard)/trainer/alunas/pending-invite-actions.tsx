"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cancelInvite, resendInvite } from "./actions";

interface Props {
  inviteId: string;
  link: string;
}

export function PendingInviteActions({ inviteId, link: initialLink }: Props) {
  const [isPending, startTransition] = useTransition();
  const [link, setLink] = useState(initialLink);
  const [linkCopied, setLinkCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkCopied(false);
    }
  }

  function handleResend() {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await resendInvite(inviteId);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      setLink(result.link);
    });
  }

  function handleCancel() {
    if (
      !window.confirm(
        "Cancelar este convite? A aluna não conseguirá mais usá-lo."
      )
    ) {
      return;
    }
    setErrorMessage(null);
    startTransition(async () => {
      const result = await cancelInvite(inviteId);
      if (!result.ok) {
        setErrorMessage(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={handleCopy} disabled={isPending}>
          {linkCopied ? "Copiado!" : "Copiar link"}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleResend} disabled={isPending}>
          {isPending ? "Processando..." : "Reenviar"}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isPending}>
          Cancelar
        </Button>
      </div>
      {errorMessage && (
        <p className="text-xs text-brand-rose">{errorMessage}</p>
      )}
    </div>
  );
}
