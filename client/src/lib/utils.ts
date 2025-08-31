import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(path: string): string {
  return `/${path.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '')}`;
}
