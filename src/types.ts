export type UserRole = 'FACILITY_OPERATOR' | 'DISTRICT_OFFICER' | 'STATE_ADMIN' | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  designation: string;
  email: string;
  facilityId?: string;
  facilityName?: string;
  facilityType?: 'PHC' | 'CHC' | 'SDH' | 'DH' | 'DIRECTORATE';
  district: string;
  state: string;
  avatarUrl?: string;
  lastLogin: string;
}

export type MainTab =
  | 'Home'
  | 'About'
  | 'Dashboard'
  | 'Data Management'
  | 'Programmes'
  | 'Facilities'
  | 'Reports'
  | 'Notifications'
  | 'Admin Panel'
  | 'Help & Support'
  | 'Login';

export type AboutSubTab = 'About HDIMS' | 'Vision & Mission' | 'How It Works';
export type DashboardSubTab = 'Overview' | 'Performance' | 'Programme Analytics' | 'Alerts';
export type DataManagementSubTab = 'Enter Data' | 'Update Data' | 'Submitted Data' | 'Data Validation';
export type ProgrammesSubTab = 'All Programmes' | 'Programme Performance';
export type FacilitiesSubTab = 'Facility List' | 'Facility Performance';
export type ReportsSubTab = 'Facility Reports' | 'District Reports' | 'State Reports' | 'Download Reports';
export type AdminSubTab = 'Users' | 'Facilities' | 'Departments' | 'Programmes' | 'Audit Logs';
export type HelpSubTab = 'FAQs' | 'User Manual' | 'Contact Support';

export interface HealthDataSubmission {
  id: string;
  reportMonth: string; // e.g., 'August 2026'
  submissionDate: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'PHC' | 'CHC' | 'SDH' | 'DH';
  district: string;
  state: string;
  submittedBy: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Verified' | 'Needs Revision';
  
  // Maternal Health Metrics
  antenatalRegistrations: number;
  highRiskPregnanciesIdentified: number;
  institutionalDeliveries: number;
  cSectionDeliveries: number;
  maternalDeaths: number;

  // Child Health & Immunization
  infantImmunizationCompleted: number;
  pentavalentDosesAdministered: number;
  measlesRubellaVaccines: number;
  neonatalDeaths: number;

  // Disease Surveillance & NCDs
  ncdHypertensionScreened: number;
  ncdDiabetesScreened: number;
  tbPresumptiveCasesScreened: number;
  malariaTestsConducted: number;

  // Infrastructure & Logistics
  totalSanctionedBeds: number;
  occupiedBedsAverage: number;
  essentialMedicinesAvailablePct: number;
  functionalColdChainEquipment: boolean;
  powerBackupFunctional: boolean;

  remarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  revisionNotes?: string;
}

export interface HealthProgramme {
  id: string;
  code: string;
  name: string;
  nodalDepartment: string;
  category: 'Maternal & Child' | 'Communicable' | 'Non-Communicable' | 'Universal Health' | 'Nutrition';
  launchYear: number;
  budgetAllocatedCr: number;
  budgetUtilizedCr: number;
  annualTarget: number;
  currentAchievement: number;
  unit: string;
  status: 'Active' | 'Under Review' | 'High Priority';
  description: string;
  nationalRank?: number;
}

export interface HealthcareFacility {
  id: string;
  code: string;
  name: string;
  type: 'PHC' | 'CHC' | 'SDH' | 'DH';
  subDistrict: string;
  district: string;
  state: string;
  operationalBeds: number;
  inChargeDoctor: string;
  contactNumber: string;
  complianceScorePct: number;
  reportingPunctualityPct: number;
  grade: 'A+' | 'A' | 'B' | 'C';
  status: 'Operational' | 'Audit Required' | 'Upgrading';
  lastReportedDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'ALERT' | 'INFO' | 'REVISION' | 'CIRCULAR';
  read: boolean;
  sender: string;
  actionLink?: { tab: MainTab; subTab?: string };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  director: string;
  officerCount: number;
  activeSchemesCount: number;
  contactEmail: string;
}
