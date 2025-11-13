import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal className handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts string or number values to number for numeric operations
 * Handles API responses that return decimals as strings
 * Returns 0 for undefined/null values
 */
export function toNum(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return 0;
  return typeof value === "string" ? parseFloat(value) : value;
}
