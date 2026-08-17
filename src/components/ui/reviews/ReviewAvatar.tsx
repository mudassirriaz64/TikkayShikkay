import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { initialsAvatar } from "@/lib/utils/avatar";

const SIZE_MAP = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-14 w-14",
} as const;

interface ReviewAvatarProps {
  name: string;
  index?: number;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

export function ReviewAvatar({
  name,
  index = 0,
  size = "md",
  className,
}: ReviewAvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full border-2 border-[var(--bg-surface-hover)] bg-[var(--bg-surface)]",
        SIZE_MAP[size],
        className,
      )}
    >
      <Image
        src={initialsAvatar(name, index)}
        alt={name}
        width={48}
        height={48}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
