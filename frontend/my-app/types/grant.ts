export interface GrantOverview {
  donor: string;
  grantName: string;
  totalApprovedBudget: number;
  totalUtilized: number;
  grantId: string;
  utilizationRate: number;
  latestRiskStatus: string;
  latestReportingMonth: string;
}

export interface GrantOverviewResponse {
  success: boolean;
  data: GrantOverview[];
}

export interface FinanceMonth {
  reportingMonth: string;
  approvedBudget: number;
  utilized: number;
  utilizationRate: number;
}

export interface BudgetLine {
  reportingMonth: string;
  budgetLine: string;
  approvedBudget: number;
  utilized: number;
  cumulativeUtilized: number;
  cumulativeUtilizationRate: number;
  financeNote: string;
}

export interface GrantFinanceResponse {
  success: boolean;
  data: {
    grantId: string;
    summary: {
      approvedBudget: number;
      utilized: number;
      utilizationRate: number;
    };
    months: FinanceMonth[];
    budgetLines: BudgetLine[];
  };
}

export interface GrantEvidenceRecord {
  recordId?: string;
  id?: string;

  type: string;
  mediaType?: string;

  reportingMonth: string;
  district: string;

  title: string;
  description?: string;
  summary?: string;

  fileName: string;
  relativePath: string;
  usageNote: string;
}

export interface GrantEvidenceResponse {
  success: boolean;
  data: {
    grantId: string;
    records: GrantEvidenceRecord[];
  };
}

export interface GrantReportMonth {
  reportingMonth: string;
  periodEndDate: string;
  reportDueDate: string;
  reportStatus: string;

  pbl: {
    schoolsCompleted: number;
    completionRate: number;
  };

  evidence: {
    schoolsWithEvidence: number;
    submissionRate: number;
  };

  attendance: {
    totalEnrollment: number;
    totalAttendance: number;
    attendanceRate: number;
  };

  riskStatus: string;
  milestoneSummary: string;
}

export interface GrantPerformanceResponse {
  success: boolean;
  data: {
    grantId: string;
    months: GrantReportMonth[];
  };
}

export interface GrantDetails {
  grant: {
    grantId: string;
    donor: string;
    grantName: string;
    periodStart?: string;
    periodEnd?: string;
    coveredDistricts: string[];
  };

  financialSummary: {
    totalApprovedBudget: number;
    totalUtilized: number;
    utilizationRate: number;
  };

  latestPerformance: {
    reportingMonth: string;
    reportStatus: string;
    pblCompletionRate: number;
    evidenceSubmissionRate: number;
    attendanceRate: number;
    riskStatus: string;
  } | null;

  monthlyPerformance: any[];

  financialRecords: any[];
}

export interface GrantDetailsResponse {
  success: boolean;
  data: GrantDetails;
}