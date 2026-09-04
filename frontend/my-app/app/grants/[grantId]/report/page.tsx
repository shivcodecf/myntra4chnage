// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";
// import api from "@/lib/api";

// type GrantReport = {
//   grantId: string;
//   donor: string;
//   grantName: string;
//   reportingMonth: string;
//   periodEndDate: string;
//   reportDueDate: string;
//   reportStatus: string;
//   coveredDistricts: string[];

//   performance: {
//     sampledSchoolRecords: number;
//     schoolsCompletedPbl: number;
//     pblCompletionRate: number;
//     schoolsWithEvidence: number;
//     evidenceSubmissionRate: number;
//     totalEnrollment: number;
//     totalAttendance: number;
//     attendanceRate: number;
//   };

//   riskStatus: string;
//   milestoneSummary: string;
//   draftReportText: string;
// };

// type GrantReportResponse = {
//   success: boolean;
//   data: GrantReport;
// };

// const percentage = (value: number) =>
//   `${(value * 100).toFixed(1)}%`;

// const formatDate = (value: string) => {
//   if (!value) return "-";

//   return new Date(value).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// export default function GrantReportPage() {
//   const params = useParams();

//   const grantId = params.grantId as string;

//   const [report, setReport] = useState<GrantReport | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!grantId) return;

//     const fetchReport = async () => {
//       try {
//         const response = await api.get<GrantReportResponse>(
//           `/grants/${grantId}/report`,
//         );

//         console.log("Grant Report API response:", response.data);

//         if (response.data.success) {
//           setReport(response.data.data);
//         } else {
//           setError("Failed to load grant report");
//         }
//       } catch (error) {
//         console.error("Grant report error:", error);

//         setError("Failed to load grant report");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [grantId]);

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-100 p-6 md:p-8">
//         <div className="max-w-6xl mx-auto">
//           <p className="text-gray-600">
//             Loading grant report...
//           </p>
//         </div>
//       </main>
//     );
//   }

//   if (error || !report) {
//     return (
//       <main className="min-h-screen bg-gray-100 p-6 md:p-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="rounded-xl border border-red-200 bg-red-50 p-6">
//             <p className="text-red-600">
//               {error || "No grant report available"}
//             </p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   const { performance } = report;

//   return (
//     <main className="min-h-screen bg-gray-100 p-6 md:p-8">
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}

//         <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
//           <div>
//             <p className="text-sm font-medium text-blue-600">
//               Grant Management
//             </p>

//             <h1 className="mt-1 text-3xl font-bold text-gray-900">
//               Grant Report
//             </h1>

//             <p className="mt-2 text-gray-600">
//               Monthly performance report for{" "}
//               <span className="font-medium text-gray-900">
//                 {report.grantName}
//               </span>
//               .
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => window.print()}
//             className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
//           >
//             Generate / Print Report
//           </button>
//         </div>

//         {/* Grant Information */}

//         <section className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
//           <div className="border-b border-gray-100 p-6">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Grant Information
//             </h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">

//             <div>
//               <p className="text-sm text-gray-500">
//                 Grant ID
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {report.grantId}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Donor
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {report.donor}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Reporting Month
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {report.reportingMonth}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Report Status
//               </p>

//               <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
//                 {report.reportStatus}
//               </span>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Period End Date
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {formatDate(report.periodEndDate)}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Report Due Date
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {formatDate(report.reportDueDate)}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Risk Status
//               </p>

//               <span
//                 className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
//                   report.riskStatus === "Critical"
//                     ? "bg-red-100 text-red-700"
//                     : report.riskStatus === "At Risk"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-green-100 text-green-700"
//                 }`}
//               >
//                 {report.riskStatus || "N/A"}
//               </span>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Sampled School Records
//               </p>

//               <p className="mt-1 font-medium text-gray-900">
//                 {performance.sampledSchoolRecords.toLocaleString()}
//               </p>
//             </div>
//           </div>

//           {/* Covered Districts */}

//           <div className="border-t border-gray-100 p-6">
//             <p className="text-sm text-gray-500">
//               Covered Districts
//             </p>

//             <div className="mt-2 flex flex-wrap gap-2">
//               {report.coveredDistricts.length === 0 ? (
//                 <span className="text-sm text-gray-500">
//                   No districts specified
//                 </span>
//               ) : (
//                 report.coveredDistricts.map((district) => (
//                   <span
//                     key={district}
//                     className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
//                   >
//                     {district}
//                   </span>
//                 ))
//               )}
//             </div>
//           </div>
//         </section>

//         {/* Performance Summary */}

//         <section className="mt-6">
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Performance Summary
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Key program performance indicators for the reporting
//               period.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//             {/* PBL */}

//             <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//               <p className="text-sm text-gray-500">
//                 PBL Completion
//               </p>

//               <p className="mt-2 text-3xl font-bold text-gray-900">
//                 {percentage(
//                   performance.pblCompletionRate,
//                 )}
//               </p>

//               <p className="mt-2 text-sm text-gray-500">
//                 {performance.schoolsCompletedPbl.toLocaleString()} schools
//                 completed PBL
//               </p>

//               <div className="mt-4 h-2 rounded-full bg-gray-200">
//                 <div
//                   className="h-2 rounded-full bg-blue-600"
//                   style={{
//                     width: `${Math.min(
//                       performance.pblCompletionRate * 100,
//                       100,
//                     )}%`,
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Evidence */}

//             <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//               <p className="text-sm text-gray-500">
//                 Evidence Submission
//               </p>

//               <p className="mt-2 text-3xl font-bold text-gray-900">
//                 {percentage(
//                   performance.evidenceSubmissionRate,
//                 )}
//               </p>

//               <p className="mt-2 text-sm text-gray-500">
//                 {performance.schoolsWithEvidence.toLocaleString()} schools
//                 submitted evidence
//               </p>

//               <div className="mt-4 h-2 rounded-full bg-gray-200">
//                 <div
//                   className="h-2 rounded-full bg-green-600"
//                   style={{
//                     width: `${Math.min(
//                       performance.evidenceSubmissionRate * 100,
//                       100,
//                     )}%`,
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Attendance */}

//             <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//               <p className="text-sm text-gray-500">
//                 Attendance
//               </p>

//               <p className="mt-2 text-3xl font-bold text-gray-900">
//                 {percentage(
//                   performance.attendanceRate,
//                 )}
//               </p>

//               <p className="mt-2 text-sm text-gray-500">
//                 {performance.totalAttendance.toLocaleString()} attendance
//                 records
//               </p>

//               <div className="mt-4 h-2 rounded-full bg-gray-200">
//                 <div
//                   className="h-2 rounded-full bg-orange-500"
//                   style={{
//                     width: `${Math.min(
//                       performance.attendanceRate * 100,
//                       100,
//                     )}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Enrollment */}

//         <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

//           <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//             <p className="text-sm text-gray-500">
//               Total Enrollment
//             </p>

//             <p className="mt-2 text-3xl font-bold text-gray-900">
//               {performance.totalEnrollment.toLocaleString()}
//             </p>

//             <p className="mt-2 text-sm text-gray-500">
//               Students enrolled across the reporting period.
//             </p>
//           </div>

//           <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
//             <p className="text-sm text-gray-500">
//               Total Attendance
//             </p>

//             <p className="mt-2 text-3xl font-bold text-gray-900">
//               {performance.totalAttendance.toLocaleString()}
//             </p>

//             <p className="mt-2 text-sm text-gray-500">
//               Attendance records reported during the period.
//             </p>
//           </div>
//         </section>

//         {/* Milestone Summary */}

//         <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
//           <div className="border-b border-gray-100 p-6">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Milestone Summary
//             </h2>
//           </div>

//           <div className="p-6">
//             {report.milestoneSummary ? (
//               <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
//                 {report.milestoneSummary}
//               </p>
//             ) : (
//               <p className="text-sm text-gray-500">
//                 No milestone summary available.
//               </p>
//             )}
//           </div>
//         </section>

//         {/* Draft Report */}

//         <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm">
//           <div className="border-b border-gray-100 p-6">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Report Narrative
//             </h2>

//             <p className="mt-1 text-sm text-gray-500">
//               Draft narrative prepared for the reporting period.
//             </p>
//           </div>

//           <div className="p-6">
//             {report.draftReportText ? (
//               <div className="whitespace-pre-line text-sm leading-7 text-gray-700">
//                 {report.draftReportText}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">
//                 No draft report narrative is available.
//               </p>
//             )}
//           </div>
//         </section>

//         {/* Print Footer */}

//         <div className="mt-8 mb-8 flex items-center justify-between">
//           <Link
//             href={`/grants/${grantId}`}
//             className="text-sm font-medium text-blue-600 hover:text-blue-800"
//           >
//             ← Back to Grant
//           </Link>

//           <button
//             type="button"
//             onClick={() => window.print()}
//             className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             Print Report
//           </button>
//         </div>

//       </div>

//       {/* Print styles */}

//       <style jsx global>{`
//         @media print {
//           body {
//             background: white !important;
//           }

//           button,
//           a {
//             display: none !important;
//           }

//           main {
//             padding: 0 !important;
//           }

//           section {
//             break-inside: avoid;
//           }
//         }
//       `}</style>
//     </main>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/api";

import {
  GrantDetailsResponse,
  GrantEvidenceResponse,
  GrantPerformanceResponse,
  GrantReportMonth,
} from "@/types/grant";

interface FinanceMonth {
  reportingMonth: string;
  approvedBudget: number;
  utilized: number;
  utilizationRate: number;
}

interface GrantFinanceResponse {
  success: boolean;
  data: {
    grantId: string;
    summary: {
      approvedBudget: number;
      utilized: number;
      utilizationRate: number;
    };
    months: FinanceMonth[];
    budgetLines: any[];
  };
}

const percentage = (value: number) =>
  `${(value * 100).toFixed(1)}%`;

const formatDate = (value?: string) => {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const riskClasses = (risk?: string) => {
  switch (risk) {
    case "On Track":
      return "bg-green-100 text-green-700";

    case "Behind":
      return "bg-orange-100 text-orange-700";

    case "At Risk":
      return "bg-yellow-100 text-yellow-700";

    case "Critical":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function GrantReportPage() {
  const params = useParams();

  const grantId = String(params.grantId);

  const [grant, setGrant] = useState<GrantDetailsResponse["data"] | null>(
    null,
  );

  const [performance, setPerformance] = useState<GrantReportMonth[]>([]);

  const [financeMonths, setFinanceMonths] = useState<FinanceMonth[]>([]);

  const [evidence, setEvidence] = useState<
    GrantEvidenceResponse["data"]["records"]
  >([]);

  const [selectedMonth, setSelectedMonth] = useState("");

  const [reportText, setReportText] = useState("");

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  /*
   * Load all structured data required for the report.
   *
   * Existing APIs:
   * /grants/:grantId
   * /grants/:grantId/performance
   * /grants/:grantId/finance
   * /grants/:grantId/evidence
   */
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          grantResponse,
          performanceResponse,
          financeResponse,
          evidenceResponse,
        ] = await Promise.all([
          api.get<GrantDetailsResponse>(
            `/grants/${grantId}`,
          ),

          api.get<GrantPerformanceResponse>(
            `/grants/${grantId}/performance`,
          ),

          api.get<GrantFinanceResponse>(
            `/grants/${grantId}/finance`,
          ),

          api.get<GrantEvidenceResponse>(
            `/grants/${grantId}/evidence`,
          ),
        ]);

        if (grantResponse.data.success) {
          setGrant(grantResponse.data.data);
        }

        if (performanceResponse.data.success) {
          const months = performanceResponse.data.data.months;

          setPerformance(months);

          /*
           * Default to latest reporting month.
           */
          if (months.length > 0) {
            setSelectedMonth(
              months[months.length - 1].reportingMonth,
            );
          }
        }

        if (financeResponse.data.success) {
          setFinanceMonths(
            financeResponse.data.data.months,
          );
        }

        if (evidenceResponse.data.success) {
          setEvidence(
            evidenceResponse.data.data.records,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load grant report data:",
          error,
        );

        setError(
          "Failed to load grant report data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (grantId) {
      fetchReportData();
    }
  }, [grantId]);

  /*
   * Selected monthly performance record.
   */
  const selectedReport = useMemo(() => {
    return performance.find(
      (item) =>
        item.reportingMonth === selectedMonth,
    );
  }, [performance, selectedMonth]);

  /*
   * Selected month's finance record.
   */
  const selectedFinance = useMemo(() => {
    return financeMonths.find(
      (item) =>
        item.reportingMonth === selectedMonth,
    );
  }, [financeMonths, selectedMonth]);

  /*
   * Evidence belonging to selected month.
   */
  const selectedEvidence = useMemo(() => {
    return evidence.filter(
      (item) =>
        item.reportingMonth === selectedMonth,
    );
  }, [evidence, selectedMonth]);

  /*
   * Deterministic report generator.
   *
   * Important:
   * No AI is required here.
   * All values come from structured database data.
   */
  const generateReport = () => {
    if (!grant || !selectedReport) {
      return;
    }

    setGenerating(true);
    setCopied(false);

    const financeUtilization =
      selectedFinance?.utilizationRate ?? 0;

    const pblRate =
      selectedReport.pbl.completionRate;

    const evidenceRate =
      selectedReport.evidence.submissionRate;

    const attendanceRate =
      selectedReport.attendance.attendanceRate;

    const risk =
      selectedReport.riskStatus || "Not specified";

    const districts =
      grant.grant.coveredDistricts?.join(", ") ||
      "No districts recorded";

    const evidenceCount =
      selectedEvidence.length;

    const weakAreas: string[] = [];

    if (pblRate < 0.75) {
      weakAreas.push("PBL completion");
    }

    if (evidenceRate < 0.75) {
      weakAreas.push("evidence submission");
    }

    if (attendanceRate < 0.75) {
      weakAreas.push("attendance");
    }

    const attentionText =
      weakAreas.length > 0
        ? `Areas requiring attention include ${weakAreas.join(
            ", ",
          )}.`
        : "The reported indicators are currently at or above the configured monitoring threshold.";

    const generatedText = `
Grant Performance Report

Grant
${grant.grant.grantName}

Donor
${grant.grant.donor}

Reporting Month
${selectedReport.reportingMonth}

Program Performance

During ${selectedReport.reportingMonth}, the grant recorded ${
      selectedReport.pbl.schoolsCompleted
    } schools completing PBL activities, representing a PBL completion rate of ${percentage(
      pblRate,
    )}.

Evidence submission was recorded for ${
      selectedReport.evidence.schoolsWithEvidence
    } schools, representing an evidence submission rate of ${percentage(
      evidenceRate,
    )}.

Attendance was ${
      selectedReport.attendance.totalAttendance.toLocaleString()
    } out of ${
      selectedReport.attendance.totalEnrollment.toLocaleString()
    }, resulting in an attendance rate of ${percentage(
      attendanceRate,
    )}.

Financial Performance

For ${selectedReport.reportingMonth}, the approved budget was ${
      selectedFinance
        ? selectedFinance.approvedBudget.toLocaleString()
        : "not available"
    } units and utilization was ${
      selectedFinance
        ? selectedFinance.utilized.toLocaleString()
        : "not available"
    } units.

The monthly utilization rate was ${percentage(
      financeUtilization,
    )}.

Milestone Status

${selectedReport.milestoneSummary || "No milestone summary recorded."}

Risk Status

${risk}

${attentionText}

Coverage

The grant covers the following districts:
${districts}

Supporting Evidence

${evidenceCount} evidence/media record(s) are linked to this reporting month.

Report Dates

Period end date: ${formatDate(
      selectedReport.periodEndDate,
    )}

Report due date: ${formatDate(
      selectedReport.reportDueDate,
    )}

This report section is generated deterministically from structured grant performance, finance, milestone, risk and evidence data. No unsupported achievements or facts have been added.
`.trim();

    /*
     * Small delay makes the generation action
     * feel like a real report-generation workflow.
     */
    setTimeout(() => {
      setReportText(generatedText);
      setGenerating(false);
    }, 300);
  };

  /*
   * Copy generated report.
   */
  const copyReport = async () => {
    if (!reportText) return;

    try {
      await navigator.clipboard.writeText(
        reportText,
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy report:",
        error,
      );
    }
  };

  /*
   * Print / save as PDF using browser print.
   */
  const printReport = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading grant report...
        </p>
      </main>
    );
  }

  if (error || !grant) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-600">
              {error ||
                "Grant report data not available"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!selectedReport) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No performance reports available.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8 print:bg-white print:p-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className="print:hidden">
          <p className="text-sm text-blue-600 font-medium">
            Grant Management
          </p>

          <div className="mt-1 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Grant Report
              </h1>

              <p className="mt-2 text-gray-600">
                Monthly performance report for{" "}
                <span className="font-medium text-gray-900">
                  {grant.grant.grantName}
                </span>
                .
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={generateReport}
                disabled={generating}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating
                  ? "Generating..."
                  : "Generate Report"}
              </button>

              {reportText && (
                <>
                  <button
                    type="button"
                    onClick={copyReport}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {copied
                      ? "Copied!"
                      : "Copy Report"}
                  </button>

                  <button
                    type="button"
                    onClick={printReport}
                    className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Print
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Reporting Month Selector */}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm print:hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Report Selection
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select the grant reporting month used to
                build the report.
              </p>
            </div>

            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reporting Month
              </label>

              <select
                value={selectedMonth}
                onChange={(event) => {
                  setSelectedMonth(
                    event.target.value,
                  );

                  setReportText("");
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {performance.map((month) => (
                  <option
                    key={month.reportingMonth}
                    value={month.reportingMonth}
                  >
                    {month.reportingMonth}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Report Preview */}

        <div
          id="grant-report"
          className="mt-8"
        >
          {/* Grant Information */}

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Grant Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
              <div>
                <p className="text-sm text-gray-500">
                  Grant ID
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {grant.grant.grantId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Donor
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {grant.grant.donor}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Reporting Month
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {selectedReport.reportingMonth}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Report Status
                </p>

                <span className="mt-1 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {selectedReport.reportStatus}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Period End Date
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {formatDate(
                    selectedReport.periodEndDate,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Report Due Date
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {formatDate(
                    selectedReport.reportDueDate,
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Risk Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${riskClasses(
                    selectedReport.riskStatus,
                  )}`}
                >
                  {selectedReport.riskStatus}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Sampled School Records
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {grant.monthlyPerformance
                    ?.find(
                      (item: any) =>
                        item.reportingMonth ===
                        selectedMonth,
                    )
                    ?.sampledSchoolRecords?.toLocaleString() ||
                    "—"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 p-6">
              <p className="text-sm text-gray-500">
                Covered Districts
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {grant.grant.coveredDistricts?.map(
                  (district) => (
                    <span
                      key={district}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {district}
                    </span>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* Performance Facts */}

          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Computed Facts
              </p>

              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                Program Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Structured performance facts for{" "}
                {selectedReport.reportingMonth}.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* PBL */}

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  PBL Completion
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {percentage(
                    selectedReport.pbl
                      .completionRate,
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {
                    selectedReport.pbl
                      .schoolsCompleted
                  }{" "}
                  schools completed
                </p>
              </div>

              {/* Evidence */}

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Evidence Submission
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {percentage(
                    selectedReport.evidence
                      .submissionRate,
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {
                    selectedReport.evidence
                      .schoolsWithEvidence
                  }{" "}
                  schools submitted evidence
                </p>
              </div>

              {/* Attendance */}

              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Attendance
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {percentage(
                    selectedReport.attendance
                      .attendanceRate,
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {selectedReport.attendance.totalAttendance.toLocaleString()}{" "}
                  /{" "}
                  {selectedReport.attendance.totalEnrollment.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Finance */}

          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Financial Facts
              </p>

              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                Budget & Utilization
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Financial information for{" "}
                {selectedReport.reportingMonth}.
              </p>
            </div>

            {selectedFinance ? (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Approved Budget
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {selectedFinance.approvedBudget.toLocaleString()}{" "}
                    units
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Utilized
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {selectedFinance.utilized.toLocaleString()}{" "}
                    units
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">
                    Utilization Rate
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {percentage(
                      selectedFinance.utilizationRate,
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  No finance record is available for this
                  reporting month.
                </p>
              </div>
            )}
          </section>

          {/* Milestones */}

          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-blue-600 font-medium">
              Milestones
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Milestone Summary
            </h2>

            <div className="mt-5 rounded-lg bg-gray-50 p-5">
              <p className="text-sm leading-7 text-gray-700">
                {selectedReport.milestoneSummary ||
                  "No milestone summary recorded."}
              </p>
            </div>
          </section>

          {/* Evidence */}

          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm text-blue-600 font-medium">
                Evidence & Media
              </p>

              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                Supporting Evidence
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Evidence records linked to{" "}
                {selectedReport.reportingMonth}.
              </p>
            </div>

            {selectedEvidence.length === 0 ? (
              <div className="mt-5 rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  No evidence/media records found for
                  this reporting month.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {selectedEvidence.map(
                  (record) => (
                    <div
                      key={
                        record.recordId ||
                        record.fileName
                      }
                      className="rounded-lg border border-gray-200 p-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {record.title}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {record.type} •{" "}
                            {record.district}
                          </p>
                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          {record.reportingMonth}
                        </span>
                      </div>

                      {record.summary && (
                        <p className="mt-3 text-sm text-gray-600">
                          {record.summary}
                        </p>
                      )}

                      {record.usageNote && (
                        <p className="mt-2 text-xs text-gray-500">
                          Usage:{" "}
                          {record.usageNote}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* Generate CTA */}

          {!reportText && (
            <section className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-6 print:hidden">
              <h2 className="text-lg font-semibold text-gray-900">
                Ready to generate the report
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                The report will be generated from the
                selected month's performance, finance,
                milestone, risk and evidence facts.
              </p>

              <button
                type="button"
                onClick={generateReport}
                disabled={generating}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {generating
                  ? "Generating..."
                  : "Generate Report"}
              </button>
            </section>
          )}

          {/* Generated Narrative */}

          {reportText && (
            <section className="mt-6 rounded-xl border border-green-200 bg-white shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 p-6 print:hidden">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Generated Narrative
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    Report-Ready Grant Section
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Deterministic narrative generated from
                    the selected structured facts.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={copyReport}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {copied
                      ? "Copied!"
                      : "Copy"}
                  </button>

                  <button
                    type="button"
                    onClick={printReport}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Print
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-700">
                  {reportText}
                </pre>
              </div>
            </section>
          )}

          {/* Traceability */}

          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Traceability
              </p>

              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                Facts Used to Generate the Report
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                These are the structured facts used by the
                deterministic report generator.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Reporting Month
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedReport.reportingMonth}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  PBL Completion
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {percentage(
                    selectedReport.pbl
                      .completionRate,
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Evidence Rate
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {percentage(
                    selectedReport.evidence
                      .submissionRate,
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Attendance Rate
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {percentage(
                    selectedReport.attendance
                      .attendanceRate,
                  )}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Utilization
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedFinance
                    ? percentage(
                        selectedFinance.utilizationRate,
                      )
                    : "—"}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Risk Status
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedReport.riskStatus}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Evidence Assets
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedEvidence.length}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Covered Districts
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {
                    grant.grant.coveredDistricts
                      .length
                  }
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Print styles */}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          #grant-report {
            margin-top: 0 !important;
          }
        }
      `}</style>
    </main>
  );
}