export interface PBLRisk {
  participation: string;
  evidenceSubmission: string;
  attendance: string;
}

export interface PBLMetrics {
  totalSchools: number;
  participatingSchools: number;
  participationPercentage: number;
  evidenceSchools: number;
  evidenceSubmissionPercentage: number;
  totalEnrollment: number;
  totalAttendance: number;
  attendancePercentage: number;
  risk: PBLRisk;
}

export interface PBLMonthly {
  month: string;
  totalSchools: number;
  participatingSchools: number;
  participationPercentage: number;
  evidenceSchools: number;
  evidenceSubmissionPercentage: number;
  totalEnrollment: number;
  totalAttendance: number;
  attendancePercentage: number;
}

export interface PBLMovementMetric {
  previous: number;
  current: number;
  change: number;
}

export interface PBLMovement {
  from: string;
  to: string;
  participation: PBLMovementMetric;
  attendance: PBLMovementMetric;
}

export interface PBLDashboard {
  filters: Record<string, string>;
  metrics: PBLMetrics;
  monthly: PBLMonthly[];
  movement: PBLMovement;
}

export interface PBLDashboardResponse {
  success: boolean;
  data: PBLDashboard;
}

export interface PBLDistrict {
  district: string;
  totalSchools: number;
  participatingSchools: number;
  participationPercentage: number;
  evidenceSchools: number;
  evidenceSubmissionPercentage: number;
  totalEnrollment: number;
  totalAttendance: number;
  attendancePercentage: number;
  overallScore: number;
  riskStatus: string;
}

export interface PBLDistrictResponse {
  success: boolean;
  data: PBLDistrict[];
}

type PBLFilter = {
  month: string;
  district: string;
  block: string;
  grade: string;
  subject: string;
};

type BlockOption = {
  block: string;
  district: string;
};

type DistrictResponse = {
  success: boolean;
  data: {
    district: string;
  }[];
};

type BlockResponse = {
  success: boolean;
  data: BlockOption[];
};