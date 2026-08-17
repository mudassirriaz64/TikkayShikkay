import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface PriceTagProps {
  price: number;
  className?: string;
}

export function PriceTag({ price, className }: PriceTagProps) {
  return (
    <span
      className={cn(
        "font-[family:var(--font-serif)] font-bold text-[var(--accent-gold)]",
        className,
      )}
    >
      {formatCurrency(price)}
    </span>
  );
}
