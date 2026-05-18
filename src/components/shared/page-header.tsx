import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn("pb-6 border-b border-brand-beige", className)}>
      <h1 className="text-3xl font-display font-semibold text-brand-charcoal">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm font-sans text-brand-gray">{subtitle}</p>
      )}
    </div>
  );
}
