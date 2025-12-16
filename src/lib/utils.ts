import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { RiskLevel } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskLevelColor(riskLevel: RiskLevel | string | undefined) {
  switch (riskLevel) {
    case 'Critical':
      return 'text-red-700 dark:text-red-500';
    case 'High':
      return 'text-orange-600 dark:text-orange-400';
    case 'Medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'Low':
      return 'text-green-600 dark:text-green-500';
    default:
      return 'text-muted-foreground';
  }
}
