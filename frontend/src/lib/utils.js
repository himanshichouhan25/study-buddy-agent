import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — merges Tailwind classes intelligently, resolving conflicts.
 * Required by every Shadcn UI component.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
