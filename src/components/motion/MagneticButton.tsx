"use client";

import { type ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { useMagnetic } from "@/hooks/useMagnetic";

export function MagneticButton(props: ComponentProps<typeof Button>) {
  const ref = useMagnetic<HTMLButtonElement>(0.3);
  return <Button ref={ref} {...props} />;
}
