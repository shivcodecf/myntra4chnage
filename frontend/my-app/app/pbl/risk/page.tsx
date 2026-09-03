"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

type PerformanceRow = {
  district?: string;
  block?: string;
  totalSchools: number;
  participatingSchools: number;
  participationPercentage: number;
  evidenceSchools: number;
  evidenceSubmissionPercentage: number;
  totalEnrollment: number;
  totalAttendance: number;
  attendancePercentage: number;
  overallScore: number;
  riskStatus: "On Track" | "Behind" | "At Risk" | "Critical";
};

type ApiResponse = {
  success: boolean;
  data: PerformanceRow[];
};

const riskOrder = {
  Critical: 0,
  "At Risk": 1,
  Behind: 2,
  "On Track": 3,
};

const riskClasses = {
  Critical: "bg-red-100 text-red-700",
  "At Risk": "bg-orange-100 text-orange-700",
  Behind: "bg-yellow-100 text-yellow-700",
  "On Track": "bg-green-100 text-green-700",
};

const formatPercentage = (value: number) =>
  `${(value * 100).toFixed(1)}%`;

const getRiskReason = (row: PerformanceRow) => {
  const gaps = [
    {
      name: "Participation",
      value: row.participationPercentage,
    },
    {
      name: "Evidence submission",
      value: row.evidenceSubmissionPercentage,
    },
    {
      name: "Attendance",
      value: row.attendancePercentage,
    },
  ];

  gaps.sort((a, b) => a.value - b.value);

  const weakest = gaps[0];

  if (weakest.value < 0.35) {
    return `${weakest.name} is critically low at ${formatPercentage(
      weakest.value,
    )}.`;
  }

  if (weakest.value < 0.6) {
    return `${weakest.name} is the main gap at ${formatPercentage(
      weakest.value,
    )}.`;
  }

  if (weakest.value < 0.75) {
    return `${weakest.name} is below the 75% target at ${formatPercentage(
      weakest.value,
    )}.`;
  }

  return "All core indicators are at or above the target.";
};

export default function RiskPage() {
  const [districts, setDistricts] = useState<PerformanceRow[]>([]);
  const [blocks, setBlocks] = useState<PerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        setLoading(true);
        setError("");

        const [districtResponse, blockResponse] =
          await Promise.all([
            api.get<ApiResponse>("/pbl/districts"),
            api.get<ApiResponse>("/pbl/blocks"),
          ]);

        if (districtResponse.data.success) {
          setDistricts(districtResponse.data.data);
        }

        if (blockResponse.data.success) {
          setBlocks(blockResponse.data.data);
        }
      } catch (error) {
        console.error("Risk analysis error:", error);
        setError("Failed to load risk analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  const riskDistricts = useMemo(() => {
    return districts
      .filter((item) => item.riskStatus !== "On Track")
      .sort(
        (a, b) =>
          riskOrder[a.riskStatus] - riskOrder[b.riskStatus],
      );
  }, [districts]);

  const riskBlocks = useMemo(() => {
    return blocks
      .filter((item) => item.riskStatus !== "On Track")
      .sort(
        (a, b) =>
          riskOrder[a.riskStatus] - riskOrder[b.riskStatus],
      );
  }, [blocks]);

  const summary = useMemo(() => {
    const all = [...districts, ...blocks];

    return {
      critical: all.filter(
        (item) => item.riskStatus === "Critical",
      ).length,

      atRisk: all.filter(
        (item) => item.riskStatus === "At Risk",
      ).length,

      behind: all.filter(
        (item) => item.riskStatus === "Behind",
      ).length,

      onTrack: all.filter(
        (item) => item.riskStatus === "On Track",
      ).length,
    };
  }, [districts, blocks]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading risk analysis...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>

          <Link
            href="/pbl"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            ← Back to PBL Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl  text-black mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pbl"
            className="text-sm  text-black text-blue-600 hover:underline"
          >
            ← Back to PBL Dashboard
          </Link>

          <p className="mt-6 text-black text-sm text-blue-600">
            Program Monitoring
          </p>

          <h1 className="text-3xl text-black font-bold text-gray-900">
            Risk & Exceptions
          </h1>

          <p className="mt-2 text-black text-gray-600">
            Identify districts and blocks that need follow-up.
          </p>
        </div>

        {/* Summary */}
        <section className="grid text-black grid-cols-1 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white text-black rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-black text-gray-500">
              Critical
            </p>

            <p className="mt-2 text-black text-3xl font-bold text-red-600">
              {summary.critical}
            </p>
          </div>

          <div className="bg-white text-black rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-black text-gray-500">
              At Risk
            </p>

            <p className="mt-2 text-black text-3xl font-bold text-orange-600">
              {summary.atRisk}
            </p>
          </div>

          <div className="bg-white text-black rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-black text-gray-500">
              Behind
            </p>

            <p className="mt-2 text-black text-3xl font-bold text-yellow-600">
              {summary.behind}
            </p>
          </div>

          <div className="bg-white text-black rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-black text-gray-500">
              On Track
            </p>

            <p className="mt-2 text-black text-3xl font-bold text-green-600">
              {summary.onTrack}
            </p>
          </div>
        </section>

        {/* Explanation */}
        <section className="bg-white text-black rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Risk Logic
          </h2>

          <p className="mt-2 text-black text-sm text-gray-600">
            Risk status is calculated deterministically from the
            performance indicators. No AI is used for risk
            classification.
          </p>

          <div className="mt-4 text-black grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div clas>
              <span className="font-medium text-black">On Track:</span>{" "}
              ≥ 75%
            </div>

            <div>
              <span className="font-medium">Behind:</span>{" "}
              60–&lt;75%
            </div>

            <div>
              <span className="font-medium">At Risk:</span>{" "}
              35–&lt;60%
            </div>

            <div>
              <span className="font-medium">Critical:</span>{" "}
              &lt;35%
            </div>
          </div>
        </section>

        {/* District Exceptions */}
        <section className="bg-white text-black rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden">
          <div className="p-6 border-b text-black border-gray-200">
            <h2 className="text-xl text-black font-semibold text-gray-900">
              District Exceptions
            </h2>

            <p className="mt-1 text-sm text-black text-gray-600">
              Districts requiring attention first.
            </p>
          </div>

          {riskDistricts.length === 0 ? (
            <div className="p-8 text-black text-center text-gray-500">
              No district exceptions found.
            </div>
          ) : (
            <div className="overflow-x-auto text-black">
              <table className="w-full text-sm text-black">
                <thead className="bg-gray-50 text-black">
                  <tr className="text-left text-black">
                    <th className="px-6 py-4 font-semibold text-black">
                      District
                    </th>

                    <th className="px-6 py-4 text-black font-semibold">
                      Risk
                    </th>

                    <th className="px-6 py-4 text-black font-semibold">
                      Participation
                    </th>

                    <th className="px-6 py-4 text-black font-semibold">
                      Evidence
                    </th>

                    <th className="px-6 py-4 text-black font-semibold">
                      Attendance
                    </th>

                    <th className="px-6 py-4 text-black font-semibold">
                      Overall
                    </th>

                    <th className="px-6 py-4 text-black font-semibold">
                      Gap
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {riskDistricts.map((row) => (
                    <tr
                      key={row.district}
                      className="border-t text-black border-gray-100"
                    >
                      <td className="px-6 text-black py-4 font-medium text-gray-900">
                        {row.district}
                      </td>

                      <td className="px-6 text-black py-4">
                        <span
                          className={`inline-flex text-black rounded-full px-3 py-1 text-xs font-medium ${
                            riskClasses[row.riskStatus]
                          }`}
                        >
                          {row.riskStatus}
                        </span>
                      </td>

                      <td className="px-6 text-black py-4">
                        {formatPercentage(
                          row.participationPercentage,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {formatPercentage(
                          row.evidenceSubmissionPercentage,
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {formatPercentage(
                          row.attendancePercentage,
                        )}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {formatPercentage(row.overallScore)}
                      </td>

                      <td className="px-6 py-4 text-gray-600 max-w-xs">
                        {getRiskReason(row)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Block Exceptions */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Block Exceptions
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Block-level areas requiring follow-up.
            </p>
          </div>

          {riskBlocks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No block exceptions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-semibold">
                      Block
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      District
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Risk
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Participation
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Evidence
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Attendance
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Overall
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {riskBlocks.map((row) => (
                    <tr
                      key={row.block}
                      className="border-t text-black border-gray-100"
                    >
                      <td className="px-6 py-4 text-black font-medium text-gray-900">
                        {row.block}
                      </td>

                      <td className="px-6 py-4 text-black text-gray-600">
                        {row.district || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex text-black rounded-full px-3 py-1 text-xs font-medium ${
                            riskClasses[row.riskStatus]
                          }`}
                        >
                          {row.riskStatus}
                        </span>
                      </td>

                      <td className="px-6 text-black py-4">
                        {formatPercentage(
                          row.participationPercentage,
                        )}
                      </td>

                      <td className="px-6 text-black py-4">
                        {formatPercentage(
                          row.evidenceSubmissionPercentage,
                        )}
                      </td>

                      <td className="px-6 text-black py-4">
                        {formatPercentage(
                          row.attendancePercentage,
                        )}
                      </td>

                      <td className="px-6 text-black py-4 font-medium">
                        {formatPercentage(row.overallScore)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}