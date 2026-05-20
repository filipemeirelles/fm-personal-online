import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  className?: string;
}

export function PageHeader({ title, description, eyebrow, className }: PageHeaderProps) {
  return (
    <div className={cn("pb-6 border-b border-brand-beige", className)}>
      {eyebrow && (
        <p className="mb-2 text-xs font-sans font-medium uppercase tracking-[0.2em] text-brand-rose">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-display font-semibold text-brand-charcoal">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm font-sans leading-6 text-brand-gray">
          {description}
        </p>
      )}
    </div>
  );
}
