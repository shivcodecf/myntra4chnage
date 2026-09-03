"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";

interface MovementMetric {
  previous: number;
  current: number;
  change: number;
}

interface PBLMovement {
  from: string;
  to: string;
  participation: MovementMetric;
  attendance: MovementMetric;
}

interface PBLDashboardResponse {
  success: boolean;
  data: {
    movement: PBLMovement;
  };
}

const formatPercentage = (value: number) =>
  `${(value * 100).toFixed(1)}%`;

const formatChange = (value: number) => {
  const percentage = value * 100;

  if (percentage > 0) {
    return `+${percentage.toFixed(1)}%`;
  }

  return `${percentage.toFixed(1)}%`;
};

export default function PBLMovementPage() {
  const [movement, setMovement] =
    useState<PBLMovement | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovement = async () => {
      try {
        const response =
          await api.get<PBLDashboardResponse>(
            "/pbl/dashboard"
          );

        console.log(
          "PBL Movement API response:",
          response.data
        );

        if (response.data.success) {
          setMovement(response.data.data.movement);
        } else {
          setError("Failed to load movement data");
        }
      } catch (error) {
        console.error("Movement API error:", error);
        setError("Failed to load movement data");
      } finally {
        setLoading(false);
      }
    };

    fetchMovement();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">
            Loading movement analysis...
          </p>
        </div>
      </main>
    );
  }

  if (error || !movement) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-600">
              {error || "Movement data unavailable"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const participationImproved =
    movement.participation.change >= 0;

  const attendanceImproved =
    movement.attendance.change >= 0;

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div>
          <p className="text-sm font-medium text-blue-600">
            PBL Analytics
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Movement Analysis
          </h1>

          <p className="mt-2 text-gray-600">
            Compare PBL performance between the latest
            reporting months.
          </p>
        </div>

        {/* Period */}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-gray-500">
            Reporting Period
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">

            <span className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-800">
              {movement.from}
            </span>

            <span className="text-gray-400">
              →
            </span>

            <span className="rounded-lg bg-blue-50 px-4 py-2 font-medium text-blue-700">
              {movement.to}
            </span>

          </div>

        </div>

        {/* Main Metrics */}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Participation */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Participation
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatPercentage(
                    movement.participation.current
                  )}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Current month
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  participationImproved
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {formatChange(
                  movement.participation.change
                )}
              </span>

            </div>

            <div className="mt-6">

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">
                  {movement.from}
                </span>

                <span className="font-medium text-gray-800">
                  {formatPercentage(
                    movement.participation.previous
                  )}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gray-400"
                  style={{
                    width: `${Math.min(
                      movement.participation.previous * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="mt-4">

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">
                  {movement.to}
                </span>

                <span className="font-medium text-gray-800">
                  {formatPercentage(
                    movement.participation.current
                  )}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{
                    width: `${Math.min(
                      movement.participation.current * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">

              <p className="text-sm text-gray-500">
                Change
              </p>

              <p
                className={`mt-1 text-xl font-semibold ${
                  participationImproved
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatChange(
                  movement.participation.change
                )}
              </p>

            </div>

          </div>

          {/* Attendance */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Attendance
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {formatPercentage(
                    movement.attendance.current
                  )}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Current month
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  attendanceImproved
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {formatChange(
                  movement.attendance.change
                )}
              </span>

            </div>

            <div className="mt-6">

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">
                  {movement.from}
                </span>

                <span className="font-medium text-gray-800">
                  {formatPercentage(
                    movement.attendance.previous
                  )}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gray-400"
                  style={{
                    width: `${Math.min(
                      movement.attendance.previous * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="mt-4">

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">
                  {movement.to}
                </span>

                <span className="font-medium text-gray-800">
                  {formatPercentage(
                    movement.attendance.current
                  )}
                </span>
              </div>

              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-orange-500"
                  style={{
                    width: `${Math.min(
                      movement.attendance.current * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>

            <div className="mt-5 border-t border-gray-100 pt-4">

              <p className="text-sm text-gray-500">
                Change
              </p>

              <p
                className={`mt-1 text-xl font-semibold ${
                  attendanceImproved
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatChange(
                  movement.attendance.change
                )}
              </p>

            </div>

          </div>

        </div>

        {/* Summary */}

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900">
            Movement Summary
          </h2>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div
              className={`rounded-lg border p-4 ${
                participationImproved
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <p className="text-sm font-medium text-gray-800">
                Participation
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Participation{" "}
                {participationImproved
                  ? "improved"
                  : "declined"}{" "}
                from{" "}
                {formatPercentage(
                  movement.participation.previous
                )}{" "}
                to{" "}
                {formatPercentage(
                  movement.participation.current
                )}.
              </p>
            </div>

            <div
              className={`rounded-lg border p-4 ${
                attendanceImproved
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <p className="text-sm font-medium text-gray-800">
                Attendance
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Attendance{" "}
                {attendanceImproved
                  ? "improved"
                  : "declined"}{" "}
                from{" "}
                {formatPercentage(
                  movement.attendance.previous
                )}{" "}
                to{" "}
                {formatPercentage(
                  movement.attendance.current
                )}.
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}