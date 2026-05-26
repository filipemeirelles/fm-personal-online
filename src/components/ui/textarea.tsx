import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-lg border border-brand-beige bg-white px-4 py-2.5 text-sm font-sans text-brand-charcoal placeholder:text-brand-gray",
        "outline-none transition-colors duration-150 resize-y",
        "focus:border-brand-rose focus:ring-1 focus:ring-brand-rose",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}
