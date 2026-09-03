"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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

export default function GrantPerformancePage() {
  const params = useParams();

  const grantId = params.grantId as string;

  const [months, setMonths] = useState<MonthPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await api.get<MonthlyPerformanceResponse>(
          `/grants/${grantId}/performance`
        );

        if (response.data.success) {
          setMonths(response.data.data.months);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load performance data.");
      } finally {
        setLoading(false);
      }
    };

    if (grantId) {
      fetchPerformance();
    }
  }, [grantId]);

  const chartData = months.map((month) => ({
    month: month.reportingMonth,
    pbl: Number((month.pbl.completionRate * 100).toFixed(1)),
    evidence: Number((month.evidence.submissionRate * 100).toFixed(1)),
    attendance: Number(
      (month.attendance.attendanceRate * 100).toFixed(1)
    ),
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600">Loading performance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Performance Analytics */}
      <div className="mb-10">
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Performance Analytics
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            Monthly Performance Trends
          </h2>

          <p className="mt-1 text-gray-600">
            Track PBL completion, evidence submission and attendance over
            time.
          </p>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />

                <Tooltip
                  formatter={(value) => `${value}%`}
                />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="pbl"
                  name="PBL Completion"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="evidence"
                  name="Evidence Submission"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="space-y-6">
        {months.map((month) => (
          <div
            key={month.reportingMonth}
            className="bg-white text-black rounded-xl border border-gray-200 shadow-sm p-6"
          >
            {/* Month Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">
                  Reporting Month
                </p>

                <h2 className="text-xl font-semibold text-gray-900">
                  {month.reportingMonth}
                </h2>
              </div>

              <div className="flex gap-3">
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                  {month.reportStatus}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
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
              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  PBL Completion
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {(month.pbl.completionRate * 100).toFixed(1)}%
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {month.pbl.schoolsCompleted} schools completed
                </p>
              </div>

              {/* Evidence */}
              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Evidence Submission
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {(month.evidence.submissionRate * 100).toFixed(1)}%
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {month.evidence.schoolsWithEvidence} schools submitted
                  evidence
                </p>
              </div>

              {/* Attendance */}
              <div className="rounded-lg bg-gray-50 p-5">
                <p className="text-sm text-gray-500">
                  Attendance
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {(month.attendance.attendanceRate * 100).toFixed(1)}%
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {month.attendance.totalAttendance.toLocaleString()} /{" "}
                  {month.attendance.totalEnrollment.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Milestone */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700">
                Milestone Summary
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {month.milestoneSummary}
              </p>
            </div>

            {/* Dates */}
            <div className="mt-5 flex flex-col md:flex-row gap-6 text-sm">
              <div>
                <span className="text-gray-500">
                  Period End:
                </span>{" "}
                <span className="font-medium">
                  {new Date(
                    month.periodEndDate
                  ).toLocaleDateString()}
                </span>
              </div>

              <div>
                <span className="text-gray-500">
                  Report Due:
                </span>{" "}
                <span className="font-medium">
                  {new Date(
                    month.reportDueDate
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}