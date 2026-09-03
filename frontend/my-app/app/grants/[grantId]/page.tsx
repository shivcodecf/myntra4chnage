"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import type {
  GrantFinanceResponse,
  GrantEvidenceRecord,
  GrantEvidenceResponse,
} from "@/types/grant";

interface MonthPerformance {
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

interface GrantFinanceSummary {
  approvedBudget: number;
  utilized: number;
  utilizationRate: number;
}

interface GrantFinanceMonth {
  reportingMonth: string;
  approvedBudget: number;
  utilized: number;
  utilizationRate: number;
}

interface BudgetLine {
  reportingMonth: string;
  budgetLine: string;
  approvedBudget: number;
  utilized: number;
  cumulativeUtilized: number;
  cumulativeUtilizationRate: number;
  financeNote: string;
}

// export interface GrantEvidenceRecord {
//   id: string;
//   type: string;
//   mediaType: string;
//   reportingMonth: string;
//   district: string;
//   title: string;
//   description: string;
//   summary?: string;
//   fileName: string;
//   relativePath: string;
//   usageNote: string;
// }

interface MonthlyPerformanceResponse {
  success: boolean;
  data: {
    grantId: string;
    months: MonthPerformance[];
  };
}

// interface GrantFinanceResponse {
//   success: boolean;
//   data: {
//     grantId: string;
//     summary: GrantFinanceSummary;
//     months: GrantFinanceMonth[];
//     budgetLines: BudgetLine[];
//   };
// }

// interface GrantEvidenceResponse {
//   success: boolean;
//   data: {
//     grantId: string;
//     records: GrantEvidenceRecord[];
//   };
// }

export default function GrantDetailPage() {
  const params = useParams();
  const router = useRouter();

  const grantId = params.grantId as string;

  const [months, setMonths] = useState<MonthPerformance[]>([]);
  const [financeSummary, setFinanceSummary] =
    useState<GrantFinanceSummary | null>(null);
  const [financeMonths, setFinanceMonths] =
    useState<GrantFinanceMonth[]>([]);
  const [budgetLines, setBudgetLines] =
    useState<BudgetLine[]>([]);
  const [evidenceRecords, setEvidenceRecords] =
    useState<GrantEvidenceRecord[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrantData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          performanceResponse,
          financeResponse,
          evidenceResponse,
        ] = await Promise.all([
          api.get<MonthlyPerformanceResponse>(
            `/grants/${grantId}/performance`
          ),

          api.get<GrantFinanceResponse>(
            `/grants/${grantId}/finance`
          ),

          api.get<GrantEvidenceResponse>(
            `/grants/${grantId}/evidence`
          ),
        ]);

        if (performanceResponse.data.success) {
          setMonths(
            performanceResponse.data.data.months
          );
        }

        if (financeResponse.data.success) {
          setFinanceSummary(
            financeResponse.data.data.summary
          );

          setFinanceMonths(
            financeResponse.data.data.months
          );

          setBudgetLines(
            financeResponse.data.data.budgetLines
          );
        }

        if (evidenceResponse.data.success) {
          setEvidenceRecords(
            evidenceResponse.data.data.records
          );
        }
      } catch (error) {
        console.error("Failed to fetch grant data:", error);
        setError("Failed to load grant data.");
      } finally {
        setLoading(false);
      }
    };

    if (grantId) {
      fetchGrantData();
    }
  }, [grantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600">
          Loading grant data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-600">
            {error}
          </p>

          <button
            onClick={() => router.refresh()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const latestMonth =
    months.length > 0
      ? months[months.length - 1]
      : null;

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Grant Overview
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Program Summary
        </h2>

        <p className="mt-2 text-gray-600">
          Overview of grant performance, financial
          utilization and evidence submission.
        </p>
      </div>

      {/* Latest Performance */}
      {latestMonth && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900">
            Latest Performance
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* PBL */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                PBL Completion
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(
                  latestMonth.pbl.completionRate * 100
                ).toFixed(1)}
                %
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {latestMonth.pbl.schoolsCompleted}{" "}
                schools completed
              </p>
            </div>

            {/* Evidence */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Evidence Submission
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(
                  latestMonth.evidence.submissionRate *
                  100
                ).toFixed(1)}
                %
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {
                  latestMonth.evidence
                    .schoolsWithEvidence
                }{" "}
                schools with evidence
              </p>
            </div>

            {/* Attendance */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Attendance
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(
                  latestMonth.attendance.attendanceRate *
                  100
                ).toFixed(1)}
                %
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {latestMonth.attendance.totalAttendance.toLocaleString()}{" "}
                /{" "}
                {latestMonth.attendance.totalEnrollment.toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Finance Overview */}
      {financeSummary && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900">
            Financial Overview
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Approved Budget */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Approved Budget
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {financeSummary.approvedBudget}
              </p>
            </div>

            {/* Utilized */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Utilized
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {financeSummary.utilized}
              </p>
            </div>

            {/* Utilization */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">
                Utilization Rate
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(
                  financeSummary.utilizationRate * 100
                ).toFixed(1)}
                %
              </p>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${Math.min(
                      financeSummary.utilizationRate *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reporting Months */}
      {months.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reporting Months
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Monthly reporting and risk status.
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/grants/${grantId}/performance`
                )
              }
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Performance →
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Month
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Report Status
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      PBL
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Evidence
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Attendance
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Risk
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {months.map((month) => (
                    <tr
                      key={month.reportingMonth}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {month.reportingMonth}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {month.reportStatus}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {(
                          month.pbl.completionRate *
                          100
                        ).toFixed(1)}
                        %
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {(
                          month.evidence.submissionRate *
                          100
                        ).toFixed(1)}
                        %
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {(
                          month.attendance
                            .attendanceRate * 100
                        ).toFixed(1)}
                        %
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            month.riskStatus ===
                            "On Track"
                              ? "bg-green-100 text-green-700"
                              : month.riskStatus ===
                                "At Risk"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {month.riskStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Finance Monthly Summary */}
      {financeMonths.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Finance
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Approved budget versus utilized amount.
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/grants/${grantId}/finance`
                )
              }
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Finance →
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Month
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Approved Budget
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Utilized
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Utilization
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {financeMonths.map((month) => (
                    <tr
                      key={month.reportingMonth}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {month.reportingMonth}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {month.approvedBudget}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {month.utilized}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {(
                          month.utilizationRate * 100
                        ).toFixed(1)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Evidence Summary */}
      {evidenceRecords.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Evidence & Media
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Available evidence and media records.
              </p>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/grants/${grantId}/evidence`
                )
              }
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View Evidence →
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {evidenceRecords
              .slice(0, 3)
              .map((record) => (
                <div
                  key={record.recordId}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {record.type}
                    </span>

                    <span className="text-xs text-gray-500">
                      {record.reportingMonth}
                    </span>
                  </div>

                  <h4 className="mt-4 font-semibold text-gray-900">
                    {record.title}
                  </h4>

                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {record.summary}
                  </p>

                  <p className="mt-4 text-xs text-gray-500">
                    {record.district}
                  </p>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {months.length === 0 &&
        !financeSummary &&
        evidenceRecords.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              No grant data available.
            </p>
          </div>
        )}
    </div>
  );
}