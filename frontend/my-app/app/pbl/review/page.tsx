"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Change = {
  metric: string;
  from: string;
  to: string;
  previous: number;
  current: number;
  change: number;
  direction: "improved" | "declined" | "unchanged";
};

type Risk = {
  metric: string;
  percentage: number;
  risk: string;
  message: string;
};

type PriorityDistrict = {
  district: string;
  overallScore: number;
  riskStatus: string;
  participationPercentage: number;
  evidenceSubmissionPercentage: number;
  attendancePercentage: number;
};

type PriorityBlock = {
  block: string;
  district: string;
  overallScore: number;
  riskStatus: string;
  participationPercentage: number;
  evidenceSubmissionPercentage: number;
  attendancePercentage: number;
};

type ReviewSummary = {
  month: string | null;

  summaryMetrics: {
    totalSchools: number;
    participatingSchools: number;
    participationPercentage: number;
    evidenceSchools: number;
    evidenceSubmissionPercentage: number;
    totalEnrollment: number;
    totalAttendance: number;
    attendancePercentage: number;
  };

  achievements: string[];

  monthOverMonthChanges: Change[];

  risks: Risk[];

  priorityDistricts: PriorityDistrict[];

  priorityBlocks: PriorityBlock[];

  discussionPoints: string[];
};

type ReviewSummaryResponse = {
  success: boolean;
  data: ReviewSummary;
};

export default function PBLReviewPage() {
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviewSummary = async () => {
      try {
        const response =
          await api.get<ReviewSummaryResponse>("/pbl/review-summary");

        console.log(
          "PBL Review Summary API response:",
          response.data,
        );

        if (response.data.success) {
          setSummary(response.data.data);
        } else {
          setError("Failed to load review summary");
        }
      } catch (error) {
        console.error("PBL review summary error:", error);

        setError("Failed to load review summary");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewSummary();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading monthly review...
        </p>
      </main>
    );
  }

  if (error || !summary) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">
          {error || "No review data available"}
        </p>
      </main>
    );
  }

  const metrics = summary.summaryMetrics;

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div>
          <p className="text-sm text-blue-600 font-medium">
            Program Monitoring
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Monthly Program Review
          </h1>

          <p className="mt-2 text-gray-600">
            Review progress, risks and priority areas for{" "}
            <span className="font-medium text-gray-900">
              {summary.month || "the latest month"}
            </span>
            .
          </p>
        </div>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* Participation */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">
              School Participation
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {(metrics.participationPercentage * 100).toFixed(1)}%
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {metrics.participatingSchools.toLocaleString()} of{" "}
              {metrics.totalSchools.toLocaleString()} schools
            </p>

            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    metrics.participationPercentage * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Evidence */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Evidence Submission
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {(metrics.evidenceSubmissionPercentage * 100).toFixed(1)}%
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {metrics.evidenceSchools.toLocaleString()} schools
              submitted evidence
            </p>

            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    metrics.evidenceSubmissionPercentage * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Attendance */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Attendance
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {(metrics.attendancePercentage * 100).toFixed(1)}%
            </p>

            <p className="mt-2 text-sm text-gray-600">
              {metrics.totalAttendance.toLocaleString()} attendance
              records
            </p>

            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    metrics.attendancePercentage * 100,
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Achievements */}

        <section className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Achievements
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Positive program outcomes for the latest reporting
              month.
            </p>
          </div>

          <div className="border-t border-gray-100">
            {summary.achievements.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">
                No major achievements identified.
              </p>
            ) : (
              summary.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-5 border-b last:border-b-0 border-gray-100"
                >
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm">
                    ✓
                  </span>

                  <p className="text-sm text-gray-700">
                    {achievement}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Month-over-Month */}

        <section className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Month-over-Month Changes
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Compare the latest reporting month with the previous
              month.
            </p>
          </div>

          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {summary.monthOverMonthChanges.map((change) => {
              const percentageChange = change.change * 100;

              const isImproved =
                change.direction === "improved";

              const isDeclined =
                change.direction === "declined";

              return (
                <div
                  key={change.metric}
                  className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {change.metric}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {change.from} → {change.to}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Previous
                      </p>

                      <p className="font-medium text-gray-900">
                        {(change.previous * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Current
                      </p>

                      <p className="font-medium text-gray-900">
                        {(change.current * 100).toFixed(1)}%
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isImproved
                          ? "bg-green-100 text-green-700"
                          : isDeclined
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {percentageChange > 0 ? "+" : ""}
                      {percentageChange.toFixed(1)} pp
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Risks */}

        <section className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Risks
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Indicators requiring attention.
            </p>
          </div>

          <div className="border-t border-gray-100">
            {summary.risks.length === 0 ? (
              <div className="p-6">
                <p className="text-sm text-green-700">
                  No major risks identified for this month.
                </p>
              </div>
            ) : (
              summary.risks.map((risk, index) => (
                <div
                  key={`${risk.metric}-${index}`}
                  className="p-5 border-b last:border-b-0 border-gray-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {risk.metric}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {risk.message}
                      </p>
                    </div>

                    <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {risk.risk}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Priority Districts */}

        <section className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Priority Districts
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Lowest-performing districts requiring review.
            </p>
          </div>

          <div className="overflow-x-auto border-t border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-6 py-3 font-medium">
                    District
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Risk
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Overall Score
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Participation
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Evidence
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Attendance
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {summary.priorityDistricts.map((district) => (
                  <tr key={district.district}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {district.district}
                    </td>

                    <td className="px-6 py-4">
                      <RiskBadge
                        risk={district.riskStatus}
                      />
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(district.overallScore * 100).toFixed(1)}%
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(
                        district.participationPercentage * 100
                      ).toFixed(1)}
                      %
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(
                        district.evidenceSubmissionPercentage *
                        100
                      ).toFixed(1)}
                      %
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(
                        district.attendancePercentage * 100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Priority Blocks */}

        <section className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Priority Blocks
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Lowest-performing blocks requiring review.
            </p>
          </div>

          <div className="overflow-x-auto border-t border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50">
                  <th className="px-6 py-3 font-medium">
                    Block
                  </th>

                  <th className="px-6 py-3 font-medium">
                    District
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Risk
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Score
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Participation
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Evidence
                  </th>

                  <th className="px-6 py-3 font-medium">
                    Attendance
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {summary.priorityBlocks.map((block) => (
                  <tr key={`${block.district}-${block.block}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {block.block}
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {block.district}
                    </td>

                    <td className="px-6 py-4">
                      <RiskBadge
                        risk={block.riskStatus}
                      />
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(block.overallScore * 100).toFixed(1)}%
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(
                        block.participationPercentage * 100
                      ).toFixed(1)}
                      %
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(
                        block.evidenceSubmissionPercentage * 100
                      ).toFixed(1)}
                      %
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {(
                        block.attendancePercentage * 100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Discussion Points */}

        <section className="mt-6 mb-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Discussion Points
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Suggested topics for the monthly program review.
            </p>
          </div>

          <div className="border-t border-gray-100">
            {summary.discussionPoints.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">
                No discussion points generated.
              </p>
            ) : (
              summary.discussionPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-5 border-b last:border-b-0 border-gray-100"
                >
                  <span className="mt-1 text-blue-600">
                    •
                  </span>

                  <p className="text-sm text-gray-700">
                    {point}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

/**
 * Reusable risk badge.
 */
function RiskBadge({ risk }: { risk: string }) {
  let className =
    "bg-gray-100 text-gray-700";

  if (risk === "Critical") {
    className = "bg-red-100 text-red-700";
  } else if (risk === "At Risk") {
    className = "bg-yellow-100 text-yellow-700";
  } else if (risk === "Behind") {
    className = "bg-orange-100 text-orange-700";
  } else if (risk === "On Track") {
    className = "bg-green-100 text-green-700";
  }

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {risk}
    </span>
  );
}