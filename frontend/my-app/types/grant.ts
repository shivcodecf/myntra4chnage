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
  recordId: string;
  type: string;
  reportingMonth: string;
  district: string;
  title: string;
  summary: string;
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