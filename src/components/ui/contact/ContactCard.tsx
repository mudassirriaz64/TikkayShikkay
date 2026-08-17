import { type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { ContactAccent } from "@/types/contact";

const accentStyles: Record<
  ContactAccent,
  { icon: string; border: string }
> = {
  whatsapp: {
    icon: "bg-[var(--whatsapp-green)]/12 text-[var(--whatsapp-green)]",
    border: "hover:border-[var(--whatsapp-green)]/40",
  },
  orange: {
    icon: "bg-[var(--accent-orange)]/12 text-[var(--accent-orange)]",
    border: "hover:border-[var(--accent-orange)]/40",
  },
  peach: {
    icon: "bg-[var(--accent-peach)]/12 text-[var(--accent-peach)]",
    border: "hover:border-[var(--accent-peach)]/40",
  },
  gold: {
    icon: "bg-[var(--accent-gold)]/12 text-[var(--accent-gold)]",
    border: "hover:border-[var(--accent-gold)]/40",
  },
};

interface ContactCardProps {
  icon?: ReactNode;
  title?: string;
  value?: string;
  helper?: string;
  href?: string;
  accent?: ContactAccent;
  children?: ReactNode;
  className?: string;
}

export function ContactCard({
  icon,
  title,
  value,
  helper,
  href,
  accent = "peach",
  children,
  className,
}: ContactCardProps) {
  const body = children ?? (
    <div className="flex items-start gap-4">
      {icon ? (
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            accentStyles[accent].icon,
          )}
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        {title ? (
          <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {title}
          </h3>
        ) : null}
        {value ? (
          <p className="mt-1 break-words text-[var(--text-body)]">{value}</p>
        ) : null}
        {helper ? (
          <p className="mt-1.5 text-sm text-[var(--text-muted)]">{helper}</p>
        ) : null}
      </div>
    </div>
  );

  const classes = cn(
    "group/card block h-full rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--bg-surface-hover)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.45),0_0_40px_rgba(255,180,162,0.08)]",
    accentStyles[accent].border,
    className,
  );

  if (!href) {
    return <div className={classes}>{body}</div>;
  }

  const isExternal = href.startsWith("http");

  return (
    <a
      href={href}
      aria-label={`${title ?? "Link"}: ${value ?? helper ?? ""}`}
      {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
      className={classes}
    >
      {body}
    </a>
  );
}
