export interface PBLDashboard {
  totalSchools: number;
  completedSchools: number;
  completionRate: number;
  evidenceSubmitted: number;
  evidenceSubmissionRate: number;
  totalAttendance: number;
  attendanceRate: number;
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