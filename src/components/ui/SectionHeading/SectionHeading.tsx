import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  eyebrowColor?: "peach" | "gold" | "muted";
  accent?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  title,
  eyebrow,
  eyebrowColor = "peach",
  accent,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow ? (
        <EyebrowBadge
          label={eyebrow}
          color={eyebrowColor}
          className={cn("mb-5", align === "center" && "mx-auto")}
        />
      ) : null}
      <h2 className="font-serif text-3xl font-bold uppercase leading-[1.05] tracking-[-0.03em] text-[var(--text-primary)] md:text-5xl">
        {title}
        {accent ? (
          <>
            {" "}
            <em className="font-normal normal-case italic">{accent}</em>
          </>
        ) : null}
      </h2>
    </div>
  );
}
