import { useMotion } from "@/providers/MotionProvider";

export function useReducedMotion() {
  return useMotion().reducedMotion;
}
