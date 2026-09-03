"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";

interface MonthlyData {
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

interface PBLDashboardResponse {
  success: boolean;
  data: {
    monthly: MonthlyData[];
  };
}

const percentage = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function PBLTrendsPage() {
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await api.get<PBLDashboardResponse>("/pbl/dashboard");

        console.log("PBL trends response:", response.data);

        if (response.data.success) {
          setMonthly(response.data.data.monthly);
        } else {
          setError("Failed to load monthly trends");
        }
      } catch (error) {
        console.error("PBL trends error:", error);
        setError("Failed to load monthly trends");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const highestParticipation = useMemo(() => {
    if (!monthly.length) return null;

    return [...monthly].sort(
      (a, b) => b.participationPercentage - a.participationPercentage,
    )[0];
  }, [monthly]);

  const highestAttendance = useMemo(() => {
    if (!monthly.length) return null;

    return [...monthly].sort(
      (a, b) => b.attendancePercentage - a.attendancePercentage,
    )[0];
  }, [monthly]);

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
            Track participation, evidence submission and attendance over time.
          </p>
        </div>

        {/* Summary Cards */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Best Participation Month</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {highestParticipation?.month ?? "—"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {highestParticipation
                ? percentage(highestParticipation.participationPercentage)
                : "—"}{" "}
              participation
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Best Attendance Month</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {highestAttendance?.month ?? "—"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {highestAttendance
                ? percentage(highestAttendance.attendancePercentage)
                : "—"}{" "}
              attendance
            </p>
          </div>
        </div>

        {/* Trend Cards */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {monthly.map((item) => (
            <div
              key={item.month}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.month}
                </h2>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  Monthly
                </span>
              </div>

              {/* Participation */}

              <div className="mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Participation</span>

                  <span className="font-medium text-gray-900">
                    {percentage(item.participationPercentage)}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-200">
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

              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Evidence</span>

                  <span className="font-medium text-gray-900">
                    {percentage(item.evidenceSubmissionPercentage)}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-purple-600"
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

              <div className="mt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Attendance</span>

                  <span className="font-medium text-gray-900">
                    {percentage(item.attendancePercentage)}
                  </span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-gray-200">
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

              {/* Counts */}

              <div className="mt-6 border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Participating Schools</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {item.participatingSchools.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Evidence Schools</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {item.evidenceSchools.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Enrollment</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {item.totalEnrollment.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Attendance</p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {item.totalAttendance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Monthly Comparison
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Compare all PBL metrics month by month.
          </p>

          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Month
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Participation
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Evidence
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Attendance
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Enrollment
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Attendance Records
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {monthly.map((item) => (
                    <tr
                      key={item.month}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {item.month}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {percentage(item.participationPercentage)}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {percentage(item.evidenceSubmissionPercentage)}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {percentage(item.attendancePercentage)}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {item.totalEnrollment.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {item.totalAttendance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
