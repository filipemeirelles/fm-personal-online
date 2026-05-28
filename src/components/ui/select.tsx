import { cn } from "@/lib/utils";
import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border border-brand-beige bg-white px-4 py-2.5 text-sm font-sans text-brand-charcoal",
        "outline-none transition-colors duration-150",
        "focus:border-brand-rose focus:ring-1 focus:ring-brand-rose",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
