import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSentenceCase(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .split('. ')
    .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
    .join('. ');
}