import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  description?: string;
  href?: string;
  className?: string;
}

export function StatCard({ label, value, description, href, className }: StatCardProps) {
  const content = (
    <div
      className={cn(
        "h-full rounded-xl border border-brand-beige bg-white px-6 py-5 shadow-sm transition-colors",
        href && "hover:border-brand-rose",
        className
      )}
    >
      <p className="text-xs font-sans font-medium uppercase tracking-[0.18em] text-brand-gray">
        {label}
      </p>
      <p className="mt-3 font-display text-4xl font-semibold text-brand-charcoal">
        {value}
      </p>
      {description && (
        <p className="mt-2 text-xs font-sans text-brand-gray">{description}</p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-rose focus-visible:ring-offset-2 focus-visible:ring-offset-brand-offwhite rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
