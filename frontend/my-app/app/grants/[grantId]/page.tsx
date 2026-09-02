"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Link from "next/link";

import type {
  GrantFinanceResponse,
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

interface MonthlyPerformanceResponse {
  success: boolean;

  data: {
    grantId: string;
    months: MonthPerformance[];
  };
}

export default function GrantDetailPage() {
  const params = useParams();
  const router = useRouter();

  const grantId = params.grantId as string;

  const [months, setMonths] = useState<MonthPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finance, setFinance] = useState<GrantFinanceResponse["data"] | null>(
    null,
  );

  const [financeLoading, setFinanceLoading] = useState(true);

  const [evidence, setEvidence] = useState<
    GrantEvidenceResponse["data"] | null
  >(null);

  const [evidenceLoading, setEvidenceLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [performanceResponse, financeResponse, evidenceResponse] =
          await Promise.all([
            api.get<MonthlyPerformanceResponse>(
              `/grants/${grantId}/performance`,
            ),

            api.get<GrantFinanceResponse>(`/grants/${grantId}/finance`),

            api.get<GrantEvidenceResponse>(`/grants/${grantId}/evidence`),
          ]);

        if (performanceResponse.data.success) {
          setMonths(performanceResponse.data.data.months);
        }

        if (financeResponse.data.success) {
          setFinance(financeResponse.data.data);
        }
        if (evidenceResponse.data.success) {
          setEvidence(evidenceResponse.data.data);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load grant data.");
      } finally {
        setLoading(false);
        setFinanceLoading(false);
        setEvidenceLoading(false);
      }
    };

    if (grantId) {
      fetchData();
    }
  }, [grantId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading grant performance...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}

        <button
          onClick={() => router.push("/")}
          className="mb-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>

        {/* Header */}

        <div className="mb-8">
          <p className="text-sm text-gray-500">Grant</p>

          <h1 className="text-3xl text-black font-bold text-gray-900">
            {grantId}
          </h1>

          <p className="mt-2 text-gray-600">
            Monthly performance and grant reporting overview.
          </p>
        </div>

        {/* Monthly performance */}

        <div className="space-y-6">
          {months.map((month) => (
            <div
              key={month.reportingMonth}
              className="bg-white text-black rounded-xl border border-gray-200 shadow-sm p-6"
            >
              {/* Month header */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Reporting Month</p>

                  <h2 className="text-xl text-black font-semibold text-gray-900">
                    {month.reportingMonth}
                  </h2>
                </div>

                <div className="flex gap-3">
                  <span className="px-3 py-1 text-black rounded-full bg-gray-100 text-gray-700 text-sm">
                    {month.reportStatus}
                  </span>

                  <span
                    className={`px-3 py-1 text-black rounded-full text-sm ${
                      month.riskStatus === "On Track"
                        ? "bg-green-100 text-green-700"
                        : month.riskStatus === "At Risk"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {month.riskStatus}
                  </span>
                </div>
              </div>

              {/* Metrics */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                {/* PBL */}

                <div className="rounded-lg text-black bg-gray-50 p-5">
                  <p className="text-sm text-black text-gray-500">
                    PBL Completion
                  </p>

                  <p className="mt-2 text-black text-2xl font-bold">
                    {(month.pbl.completionRate * 100).toFixed(1)}%
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {month.pbl.schoolsCompleted} schools completed
                  </p>
                </div>

                {/* Evidence */}

                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="text-sm text-black text-gray-500">
                    Evidence Submission
                  </p>

                  <p className="mt-2 text-black text-2xl font-bold">
                    {(month.evidence.submissionRate * 100).toFixed(1)}%
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {month.evidence.schoolsWithEvidence} schools submitted
                    evidence
                  </p>
                </div>

                {/* Attendance */}

                <div className="rounded-lg text-black bg-gray-50 p-5">
                  <p className="text-sm text-black text-gray-500">Attendance</p>

                  <p className="mt-2 text-black text-2xl font-bold">
                    {(month.attendance.attendanceRate * 100).toFixed(1)}%
                  </p>

                  <p className="mt-1 text-black text-sm text-gray-500">
                    {month.attendance.totalAttendance.toLocaleString()} /{" "}
                    {month.attendance.totalEnrollment.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Milestone */}

              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-sm text-black font-medium text-gray-700">
                  Milestone Summary
                </p>

                <p className="mt-2 text-black text-sm text-gray-600">
                  {month.milestoneSummary}
                </p>
              </div>

              {/* Dates */}

              <div className="mt-5 flex flex-col md:flex-row gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Period End:</span>{" "}
                  <span className="font-medium text-black">
                    {new Date(month.periodEndDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500">Report Due:</span>{" "}
                  <span className="font-medium text-black">
                    {new Date(month.reportDueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Finance Section */}

        <div className="mt-10">
          <div className="mb-6">
            <p className="text-sm text-gray-500">Financial Overview</p>

            <h2 className="text-2xl text-black font-bold text-gray-900">
              Budget & Finance
            </h2>

            <p className="mt-1 text-gray-600">
              Track approved budget, utilization and budget-line performance.
            </p>
          </div>

          {financeLoading ? (
            <div className="bg-white text-black rounded-xl border p-6">
              <p className="text-gray-500">Loading financial data...</p>
            </div>
          ) : finance ? (
            <>
              {/* Summary cards */}

              <div className="grid text-black grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white text-black rounded-xl border border-gray-200 shadow-sm p-6">
                  <p className="text-sm text-gray-500">Approved Budget</p>

                  <p className="mt-2 text-black text-3xl font-bold text-gray-900">
                    {finance.summary.approvedBudget.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white text-black rounded-xl border border-gray-200 shadow-sm p-6">
                  <p className="text-sm text-gray-500">Total Utilized</p>

                  <p className="mt-2 text-black text-3xl font-bold text-gray-900">
                    {finance.summary.utilized.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white text-black rounded-xl border border-gray-200 shadow-sm p-6">
                  <p className="text-sm  text-black text-gray-500">
                    Utilization Rate
                  </p>

                  <p className="mt-2 text-black text-3xl font-bold text-gray-900">
                    {(finance.summary.utilizationRate * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Monthly finance */}

              <div className="mt-6 text-black  bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg text-black font-semibold text-gray-900">
                  Monthly Budget Utilization
                </h3>

                <div className="overflow-x-auto mt-5">
                  <table className="w-full text-black text-sm">
                    <thead>
                      <tr className="border-b text-black  text-left">
                        <th className="py-3 text-black pr-6">Month</th>

                        <th className="py-3 text-black pr-6">
                          Approved Budget
                        </th>

                        <th className="py-3 text-black pr-6">Utilized</th>

                        <th className="py-3">Utilization</th>
                      </tr>
                    </thead>

                    <tbody>
                      {finance.months.map((month) => (
                        <tr
                          key={month.reportingMonth}
                          className="border-b last:border-0"
                        >
                          <td className="py-4 pr-6 font-medium">
                            {month.reportingMonth}
                          </td>

                          <td className="py-4 pr-6">
                            {month.approvedBudget.toLocaleString()}
                          </td>

                          <td className="py-4 pr-6">
                            {month.utilized.toLocaleString()}
                          </td>

                          <td className="py-4">
                            {(month.utilizationRate * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Budget lines */}

              <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg text-black font-semibold text-gray-900">
                  Budget Line Details
                </h3>

                <div className="overflow-x-auto mt-5">
                  <table className="w-full text-black text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 text-black pr-6">Month</th>

                        <th className="py-3 text-black pr-6">Budget Line</th>

                        <th className="py-3 text-black pr-6">Approved</th>

                        <th className="py-3 pr-6">Utilized</th>

                        <th className="py-3 pr-6">Cumulative</th>

                        <th className="py-3 pr-6">Utilization</th>

                        <th className="py-3">Finance Note</th>
                      </tr>
                    </thead>

                    <tbody>
                      {finance.budgetLines.map((line, index) => (
                        <tr
                          key={`${line.reportingMonth}-${line.budgetLine}-${index}`}
                          className="border-b last:border-0"
                        >
                          <td className="py-4 pr-6">{line.reportingMonth}</td>

                          <td className="py-4 pr-6 font-medium">
                            {line.budgetLine}
                          </td>

                          <td className="py-4 pr-6">
                            {line.approvedBudget.toLocaleString()}
                          </td>

                          <td className="py-4 pr-6">
                            {line.utilized.toLocaleString()}
                          </td>

                          <td className="py-4 pr-6">
                            {line.cumulativeUtilized.toLocaleString()}
                          </td>

                          <td className="py-4 pr-6">
                            {(line.cumulativeUtilizationRate * 100).toFixed(1)}%
                          </td>

                          <td className="py-4">{line.financeNote}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
        {/* Evidence & Media */}

        <div className="mt-10">
          <div className="mb-6">
            <p className="text-sm text-gray-500">Supporting Materials</p>

            <h2 className="text-2xl text-black font-bold">Evidence & Media</h2>

            <p className="mt-1 text-gray-600">
              Supporting evidence, media records and reporting materials.
            </p>
          </div>

          {evidenceLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <p className="text-gray-500">Loading evidence...</p>
            </div>
          ) : evidence && evidence.records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evidence.records.map((record) => (
                <div
                  key={record.recordId}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  {/* Media preview */}

                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <div className="text-center px-4">
                      <p className="text-4xl mb-2">
                        {record.type === "image" ? "🖼️" : "📰"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {record.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {/* Content */}

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                        {record.type.replace("_", " ")}
                      </span>

                      <span className="text-xs text-gray-500">
                        {record.reportingMonth}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-gray-900">
                      {record.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                      {record.summary}
                    </p>

                    <div className="mt-4 space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">District:</span>{" "}
                        <span className="font-medium text-gray-800">
                          {record.district}
                        </span>
                      </div>

                      <div>
                        <span className="text-gray-500">File:</span>{" "}
                        <span className="font-medium text-gray-800 break-all">
                          {record.fileName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Usage Note</p>

                      <p className="mt-1 text-xs text-gray-600">
                        {record.usageNote}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <p className="text-gray-500">No evidence found for this grant.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
