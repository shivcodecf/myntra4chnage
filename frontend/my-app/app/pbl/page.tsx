"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import type { PBLDashboardData, PBLDashboardResponse } from "@/types/pbl";
import Link from "next/link";

export default function PBLPage() {
  const [dashboard, setDashboard] = useState<PBLDashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get<PBLDashboardResponse>("/pbl/dashboard");

        console.log("PBL Dashboard API response:", response.data);

        if (response.data.success) {
          setDashboard(response.data.data);
        } else {
          setError("Failed to load PBL dashboard");
        }
      } catch (error) {
        console.error("PBL dashboard error:", error);

        setError("Failed to load PBL dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading PBL dashboard...</p>
      </main>
    );
  }

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-600">{error || "No dashboard data available"}</p>
      </main>
    );
  }

  const { metrics, movement } = dashboard;

  const participationPercentage = metrics.participationPercentage * 100;

  const evidencePercentage = metrics.evidenceSubmissionPercentage * 100;

  const attendancePercentage = metrics.attendancePercentage * 100;

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div>
          <p className="text-sm text-blue-600 font-medium">
            Program Monitoring
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            PBL Dashboard
          </h1>

        

          <p className="mt-2 text-gray-600">
            Monitor project-based learning participation, evidence submission
            and attendance.
          </p>
        </div>

        {/* KPI Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Participation */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">School Participation</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {participationPercentage.toFixed(1)}%
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {metrics.risk.participation}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {metrics.participatingSchools.toLocaleString()} of{" "}
              {metrics.totalSchools.toLocaleString()} schools participating
            </p>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(participationPercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Evidence */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Evidence Submission</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {evidencePercentage.toFixed(1)}%
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {metrics.risk.evidenceSubmission}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {metrics.evidenceSchools.toLocaleString()} schools submitted
              evidence
            </p>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(evidencePercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Attendance */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Attendance</p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {attendancePercentage.toFixed(1)}%
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                {metrics.risk.attendance}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {metrics.totalAttendance.toLocaleString()} attendance records
            </p>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(attendancePercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">Total Enrollment</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {metrics.totalEnrollment.toLocaleString()}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Students enrolled across participating schools
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">Latest Movement</p>

            <p className="mt-2 text-lg font-semibold text-gray-900">
              {movement.from} → {movement.to}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Participation</p>

                <p className="mt-1 font-semibold text-green-600">
                  +{(movement.participation.change * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Attendance</p>

                <p className="mt-1 font-semibold text-green-600">
                  +{(movement.attendance.change * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Navigation */}

        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              PBL Analytics
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Explore detailed program performance.
            </p>
          </div>

          <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-3">
            <a
              href="/pbl/monthly"
              className="p-6 hover:bg-gray-50 transition border-b md:border-b-0 md:border-r border-gray-100"
            >
              <h3 className="font-semibold text-gray-900">Monthly Trends</h3>

              <p className="mt-1 text-sm text-gray-500">
                View PBL performance over time.
              </p>
            </a>

            <a
              href="/pbl/districts"
              className="p-6 hover:bg-gray-50 transition border-b md:border-b-0 md:border-r border-gray-100"
            >
              <h3 className="font-semibold text-gray-900">District Analysis</h3>

              <p className="mt-1 text-sm text-gray-500">
                Compare performance across districts.
              </p>
            </a>

            <a href="/pbl/blocks" className="p-6 hover:bg-gray-50 transition">
              <h3 className="font-semibold text-gray-900">Block Analysis</h3>

              <p className="mt-1 text-sm text-gray-500">
                Analyze block-level performance.
              </p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
