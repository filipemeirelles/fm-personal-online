import { cn } from "@/lib/utils";
import { LabelHTMLAttributes } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-sans font-medium uppercase tracking-wide text-brand-charcoal",
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
}
