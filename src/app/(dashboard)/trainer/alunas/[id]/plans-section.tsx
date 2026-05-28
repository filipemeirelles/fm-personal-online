"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  activatePlan,
  createPlan,
  deactivatePlan,
  deletePlan,
} from "./planos/actions";

export interface PlanRow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

interface Props {
  studentId: string;
  plans: PlanRow[];
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value: string | null) {
  if (!value) return null;
  // value vem como YYYY-MM-DD; tratamos como data local.
  const [year, month, day] = value.split("-").map(Number);
  return dateFormatter.format(new Date(year, month - 1, day));
}

export function PlansSection({ studentId, plans }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  function resetForm() {
    setName("");
    setDescription("");
    setStartsAt("");
    setEndsAt("");
    setShowForm(false);
  }

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const result = await createPlan({
        studentId,
        name,
        description,
        startsAt,
        endsAt,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      resetForm();
      router.push(`/trainer/alunas/${studentId}/planos/${result.planId}`);
    });
  }

  function handleActivate(planId: string) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await activatePlan(planId);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleDeactivate(planId: string) {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await deactivatePlan(planId);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  function handleDelete(planId: string) {
    if (!window.confirm("Excluir este plano e todos os treinos dele?")) {
      return;
    }
    setErrorMessage(null);
    startTransition(async () => {
      const result = await deletePlan(planId);
      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-gray">
          {plans.length === 0
            ? "Nenhum plano criado ainda."
            : `${plans.length} plano(s). Apenas um fica ativo por vez.`}
        </p>
        <Button
          size="sm"
          variant={showForm ? "ghost" : "primary"}
          onClick={() => setShowForm((v) => !v)}
          disabled={isPending}
        >
          {showForm ? "Cancelar" : "Novo plano"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="grid gap-4 rounded-xl border border-brand-beige bg-brand-offwhite p-4 sm:grid-cols-2"
        >
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="plan-name">Nome do plano</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Hipertrofia - Bloco 1"
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="plan-desc">Descrição</Label>
            <Input
              id="plan-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objetivo, divisão, observações"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-start">Início (opcional)</Label>
            <Input
              id="plan-start"
              type="date"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan-end">Fim (opcional)</Label>
            <Input
              id="plan-end"
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar e montar treinos"}
            </Button>
          </div>
        </form>
      )}

      {errorMessage && (
        <p className="rounded-lg border border-brand-rose/40 bg-brand-rose/10 px-4 py-3 text-sm text-brand-charcoal">
          {errorMessage}
        </p>
      )}

      {plans.length > 0 && (
        <ul className="divide-y divide-brand-beige">
          {plans.map((plan) => {
            const start = formatDate(plan.starts_at);
            const end = formatDate(plan.ends_at);
            return (
              <li
                key={plan.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-brand-charcoal">
                      {plan.name}
                    </p>
                    {plan.is_active && <Badge variant="rose">Ativo</Badge>}
                  </div>
                  {plan.description && (
                    <p className="text-xs text-brand-gray">{plan.description}</p>
                  )}
                  {(start || end) && (
                    <p className="text-xs text-brand-gray">
                      {start ? `De ${start}` : ""}
                      {end ? ` até ${end}` : ""}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/trainer/alunas/${studentId}/planos/${plan.id}`}
                    className="text-sm font-medium text-brand-charcoal underline decoration-brand-rose underline-offset-4 hover:text-brand-rose"
                  >
                    Montar treinos
                  </Link>
                  {plan.is_active ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeactivate(plan.id)}
                      disabled={isPending}
                    >
                      Desativar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleActivate(plan.id)}
                      disabled={isPending}
                    >
                      Ativar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-brand-rose hover:bg-brand-rose/10"
                    onClick={() => handleDelete(plan.id)}
                    disabled={isPending}
                  >
                    Excluir
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
