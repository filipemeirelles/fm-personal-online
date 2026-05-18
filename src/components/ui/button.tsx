import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-charcoal text-white hover:bg-brand-charcoal/85",
  secondary:
    "bg-brand-rose/25 text-brand-charcoal hover:bg-brand-rose/40",
  outline:
    "border border-brand-charcoal text-brand-charcoal bg-transparent hover:bg-brand-charcoal/5",
  ghost:
    "bg-transparent text-brand-charcoal hover:bg-brand-beige",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-sans font-medium tracking-wide transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
