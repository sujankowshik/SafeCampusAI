import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { RiskLevel } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRiskLevelColor(riskLevel: RiskLevel | string | undefined) {
  switch (riskLevel) {
    case 'Critical':
      return 'text-red-500';
    case 'High':
      return 'text-orange-500';
    case 'Medium':
      return 'text-yellow-500';
    case 'Low':
    default:
      return 'text-green-500';
  }
}
