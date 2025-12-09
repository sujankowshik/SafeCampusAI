import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  isAdmin: boolean;
}

export type ReportType = 'harassment' | 'bullying' | 'theft' | 'mental health' | 'infrastructure issue' | 'other';
export type ReportStatus = 'New' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Incident {
  id: string;
  title: string;
  description: string;
  reportType: ReportType;
  locationText: string;
  dateTime: Timestamp;
  allowFollowUp: boolean;
  contactEmail: string | null;
  attachments: string[];
  isAnonymous: boolean;
  
  // User-related fields
  createdByUserId: string | null;
  
  // AI-generated fields
  aiCategory?: string;
  aiRiskLevel?: RiskLevel | string;
  aiSummary?: string;

  // Admin fields
  status: ReportStatus;
  adminNotes?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
