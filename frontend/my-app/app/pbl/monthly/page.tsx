"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

interface MonthlyPBL {
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

interface MonthlyPBLResponse {
  success: boolean;
  data: MonthlyPBL[];
}

const percentage = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function PBLMonthlyPage() {
  const [monthly, setMonthly] = useState<MonthlyPBL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const response = await api.get<MonthlyPBLResponse>("/pbl/monthly");

        console.log("PBL Monthly API response:", response.data);

        if (response.data.success) {
          setMonthly(response.data.data);
        } else {
          setError("Failed to load monthly PBL data");
        }
      } catch (error) {
        console.error("Monthly PBL error:", error);
        setError("Failed to load monthly PBL data");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthly();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading monthly trends...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div>
          <p className="text-sm font-medium text-blue-600">PBL Analytics</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Monthly Trends
          </h1>

          <p className="mt-2 text-gray-600">
            Track participation, evidence submission and attendance month by
            month.
          </p>
        </div>

        {monthly.length === 0 ? (
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-gray-500">No monthly PBL data available.</p>
          </div>
        ) : (
          <>
            {/* Trend Cards */}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Latest Participation */}

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Latest Participation</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {percentage(
                    monthly[monthly.length - 1].participationPercentage,
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {monthly[monthly.length - 1].month}
                </p>
              </div>

              {/* Latest Evidence */}

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Latest Evidence Submission
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {percentage(
                    monthly[monthly.length - 1].evidenceSubmissionPercentage,
                  )}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {monthly[monthly.length - 1].month}
                </p>
              </div>

              {/* Latest Attendance */}

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Latest Attendance</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {percentage(monthly[monthly.length - 1].attendancePercentage)}
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  {monthly[monthly.length - 1].month}
                </p>
              </div>
            </div>

            {/* Visual Trend */}

            <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Performance Trend
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Percentage performance across reporting months.
                </p>
              </div>

              <div className="space-y-6">
                {monthly.map((item) => (
                  <div key={item.month}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {item.month}
                      </span>

                      <span className="text-sm text-gray-500">
                        Participation {percentage(item.participationPercentage)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Participation */}

                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Participation</span>

                          <span>
                            {percentage(item.participationPercentage)}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{
                              width: `${Math.min(
                                item.participationPercentage * 100,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Evidence */}

                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Evidence</span>

                          <span>
                            {percentage(item.evidenceSubmissionPercentage)}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-600"
                            style={{
                              width: `${Math.min(
                                item.evidenceSubmissionPercentage * 100,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Attendance */}

                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Attendance</span>

                          <span>{percentage(item.attendancePercentage)}</span>
                        </div>

                        <div className="h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-orange-500"
                            style={{
                              width: `${Math.min(
                                item.attendancePercentage * 100,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Table */}

            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Monthly Performance
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Detailed month-wise PBL performance.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px] text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Month
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Schools
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Participating
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Participation
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Evidence
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Evidence %
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Enrollment
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Attendance
                        </th>

                        <th className="px-6 py-4 font-semibold text-gray-700">
                          Attendance %
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {monthly.map((item) => (
                        <tr
                          key={item.month}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {item.month}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {item.totalSchools.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {item.participatingSchools.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-700">
                            {percentage(item.participationPercentage)}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {item.evidenceSchools.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-700">
                            {percentage(item.evidenceSubmissionPercentage)}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {item.totalEnrollment.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {item.totalAttendance.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 font-medium text-gray-700">
                            {percentage(item.attendancePercentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
