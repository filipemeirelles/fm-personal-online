"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { updateSuggestedLoad } from "./actions";

interface Props {
  workoutExerciseId: string;
  initialLoad: string | null;
}

export function LoadInput({ workoutExerciseId, initialLoad }: Props) {
  const [value, setValue] = useState(initialLoad ?? "");
  const [savedValue, setSavedValue] = useState(initialLoad ?? "");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleBlur() {
    if (value === savedValue) return;
    setStatus("idle");
    startTransition(async () => {
      const result = await updateSuggestedLoad(workoutExerciseId, value);
      if (!result.ok) {
        setStatus("error");
        setErrorMessage(result.message);
        return;
      }
      setSavedValue(value);
      setStatus("saved");
      setErrorMessage(null);
      setTimeout(() => setStatus("idle"), 1500);
    });
  }

  return (
    <div className="space-y-1">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        placeholder="Sua carga"
        disabled={isPending}
        aria-label="Carga utilizada"
        className="max-w-[10rem]"
      />
      {status === "saved" && (
        <p className="text-xs text-brand-gray">Carga salva.</p>
      )}
      {status === "error" && errorMessage && (
        <p className="text-xs text-brand-rose">{errorMessage}</p>
      )}
    </div>
  );
}
