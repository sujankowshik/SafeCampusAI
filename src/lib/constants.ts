import type { ReportType, ReportStatus, RiskLevel } from "./types";

export const REPORT_TYPES: ReportType[] = [
  'harassment',
  'bullying',
  'theft',
  'mental health',
  'infrastructure issue',
  'other',
];

export const REPORT_STATUSES: ReportStatus[] = [
  'New',
  'Under Review',
  'In Progress',
  'Resolved',
  'Closed',
];

export const RISK_LEVELS: RiskLevel[] = [
  'Low',
  'Medium',
  'High',
  'Critical',
];
