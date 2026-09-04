"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import api from "@/lib/api";

import {
  PBLDashboard,
  PBLDashboardResponse,
  PBLFilter,
  BlockOption,
  DistrictResponse,
  BlockResponse,
} from "@/types/pbl";

export default function PBLPage() {
  const [dashboard, setDashboard] =
    useState<PBLDashboard | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState<PBLFilter>({
    month: "",
    district: "",
    block: "",
    grade: "",
    subject: "",
  });

  const [appliedFilters, setAppliedFilters] =
    useState<PBLFilter>({
      month: "",
      district: "",
      block: "",
      grade: "",
      subject: "",
    });

  const [districts, setDistricts] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<BlockOption[]>([]);

  /*
   * Reporting months provided by the assignment.
   */
  const months = [
    "2025-07",
    "2025-08",
    "2025-09",
  ];

  const grades = ["6", "7", "8"];

  const subjects = [
    "Math",
    "Science",
  ];

  // --------------------------------------------------
  // Fetch Dashboard
  // --------------------------------------------------

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const params = Object.fromEntries(
          Object.entries(appliedFilters).filter(
            ([, value]) => value !== "",
          ),
        );

        const response =
          await api.get<PBLDashboardResponse>(
            "/pbl/dashboard",
            {
              params,
            },
          );

        if (response.data.success) {
          setDashboard(response.data.data);
        } else {
          setError("Failed to load PBL dashboard");
        }
      } catch (error) {
        console.error(
          "PBL dashboard error:",
          error,
        );

        setError(
          "Failed to load PBL dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [appliedFilters]);

  // --------------------------------------------------
  // Fetch Filter Options
  // --------------------------------------------------

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [
          districtResponse,
          blockResponse,
        ] = await Promise.all([
          api.get<DistrictResponse>(
            "/pbl/districts",
          ),
          api.get<BlockResponse>(
            "/pbl/blocks",
          ),
        ]);

        // Districts

        if (districtResponse.data.success) {
          const districtNames =
            districtResponse.data.data
              .map(
                (item) => item.district,
              )
              .filter(Boolean)
              .sort();

          setDistricts(
            Array.from(
              new Set(districtNames),
            ),
          );
        }

        // Blocks

        if (blockResponse.data.success) {
          const blockOptions =
            blockResponse.data.data
              .filter(
                (item) => item.block,
              )
              .sort((a, b) =>
                a.block.localeCompare(
                  b.block,
                ),
              );

          setBlocks(blockOptions);
        }
      } catch (error) {
        console.error(
          "Failed to load PBL filter options:",
          error,
        );
      }
    };

    fetchFilterOptions();
  }, []);

  // --------------------------------------------------
  // Filter Blocks Based On District
  // --------------------------------------------------

  const filteredBlocks = filters.district
    ? blocks.filter(
        (block) =>
          block.district ===
          filters.district,
      )
    : blocks;

  // --------------------------------------------------
  // Handle Filter Changes
  // --------------------------------------------------

  const handleFilterChange = (
    field: keyof PBLFilter,
    value: string,
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: value,

      /*
       * Reset block when district changes.
       */
      ...(field === "district"
        ? { block: "" }
        : {}),
    }));
  };

  // --------------------------------------------------
  // Apply Filters
  // --------------------------------------------------

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters = () => {
    const emptyFilters: PBLFilter = {
      month: "",
      district: "",
      block: "",
      grade: "",
      subject: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">
          Loading PBL dashboard...
        </p>
      </main>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !dashboard) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600">
            {error ||
              "No dashboard data available"}
          </p>

          <button
            type="button"
            onClick={() => {
              setAppliedFilters({
                ...appliedFilters,
              });
            }}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Dashboard Data
  // --------------------------------------------------

  const { metrics, movement } =
    dashboard;

  // --------------------------------------------------
  // KPI Percentages
  // --------------------------------------------------

  const participationPercentage =
    metrics.participationPercentage * 100;

  const evidencePercentage =
    metrics.evidenceSubmissionPercentage *
    100;

  const attendancePercentage =
    metrics.attendancePercentage * 100;

  // --------------------------------------------------
  // Safe Movement Handling
  // --------------------------------------------------

  const participationChange =
    movement?.participation
      ? movement.participation.change * 100
      : null;

  const attendanceChange =
    movement?.attendance
      ? movement.attendance.change * 100
      : null;

  const hasMovement =
    Boolean(
      movement?.from &&
        movement?.to &&
        movement?.participation &&
        movement?.attendance,
    );

  // --------------------------------------------------
  // Helper
  // --------------------------------------------------

  const getChangeClass = (
    value: number | null,
  ) => {
    if (value === null) {
      return "text-gray-600";
    }

    if (value > 0) {
      return "text-green-600";
    }

    if (value < 0) {
      return "text-red-600";
    }

    return "text-gray-600";
  };

  const formatChange = (
    value: number | null,
  ) => {
    if (value === null) {
      return "N/A";
    }

    return `${value > 0 ? "+" : ""}${value.toFixed(
      1,
    )} pp`;
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------ */}

        <div>
          <p className="text-sm text-blue-600 font-medium">
            Program Monitoring
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            PBL Dashboard
          </h1>

          <p className="mt-2 text-gray-600">
            Monitor project-based learning
            participation, evidence submission
            and attendance.
          </p>
        </div>

        {/* ------------------------------------------ */}
        {/* Filters */}
        {/* ------------------------------------------ */}

        <section className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Filters
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Filter the PBL dashboard by
              reporting period and program
              dimensions.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

            {/* Month */}

            <div>
              <label
                htmlFor="month"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Month
              </label>

              <select
                id="month"
                value={filters.month}
                onChange={(event) =>
                  handleFilterChange(
                    "month",
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">
                  All Months
                </option>

                {months.map((month) => (
                  <option
                    key={month}
                    value={month}
                  >
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}

            <div>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                District
              </label>

              <select
                id="district"
                value={filters.district}
                onChange={(event) =>
                  handleFilterChange(
                    "district",
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">
                  All Districts
                </option>

                {districts.map(
                  (district) => (
                    <option
                      key={district}
                      value={district}
                    >
                      {district}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Block */}

            <div>
              <label
                htmlFor="block"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Block
              </label>

              <select
                id="block"
                value={filters.block}
                onChange={(event) =>
                  handleFilterChange(
                    "block",
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">
                  All Blocks
                </option>

                {filteredBlocks.map(
                  (block) => (
                    <option
                      key={`${block.district}-${block.block}`}
                      value={block.block}
                    >
                      {block.block}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Grade */}

            <div>
              <label
                htmlFor="grade"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Grade
              </label>

              <select
                id="grade"
                value={filters.grade}
                onChange={(event) =>
                  handleFilterChange(
                    "grade",
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">
                  All Grades
                </option>

                {grades.map((grade) => (
                  <option
                    key={grade}
                    value={grade}
                  >
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject
              </label>

              <select
                id="subject"
                value={filters.subject}
                onChange={(event) =>
                  handleFilterChange(
                    "subject",
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="">
                  All Subjects
                </option>

                {subjects.map(
                  (subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Filter Buttons */}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={applyFilters}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </section>

        {/* ------------------------------------------ */}
        {/* KPI Cards */}
        {/* ------------------------------------------ */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* Participation */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  School Participation
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {participationPercentage.toFixed(
                    1,
                  )}
                  %
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {metrics.risk.participation}
              </span>

            </div>

            <p className="mt-3 text-sm text-gray-600">
              {metrics.participatingSchools.toLocaleString()}{" "}
              of{" "}
              {metrics.totalSchools.toLocaleString()}{" "}
              schools participating
            </p>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        participationPercentage,
                        0,
                      ),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Evidence */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Evidence Submission
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {evidencePercentage.toFixed(
                    1,
                  )}
                  %
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {metrics.risk.evidenceSubmission}
              </span>

            </div>

            <p className="mt-3 text-sm text-gray-600">
              {metrics.evidenceSchools.toLocaleString()}{" "}
              schools submitted evidence
            </p>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        evidencePercentage,
                        0,
                      ),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Attendance */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Attendance
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {attendancePercentage.toFixed(
                    1,
                  )}
                  %
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                {metrics.risk.attendance}
              </span>

            </div>

            <p className="mt-3 text-sm text-gray-600">
              {metrics.totalAttendance.toLocaleString()}{" "}
              attendance records
            </p>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        attendancePercentage,
                        0,
                      ),
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* Additional Metrics */}
        {/* ------------------------------------------ */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Enrollment */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Total Enrollment
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {metrics.totalEnrollment.toLocaleString()}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Students enrolled across
              participating schools
            </p>
          </div>

          {/* Movement */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

            <p className="text-sm text-gray-500">
              Latest Movement
            </p>

            {hasMovement ? (
              <>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {movement.from} →{" "}
                  {movement.to}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-4">

                  {/* Participation Change */}

                  <div>
                    <p className="text-xs text-gray-500">
                      Participation
                    </p>

                    <p
                      className={`mt-1 font-semibold ${getChangeClass(
                        participationChange,
                      )}`}
                    >
                      {formatChange(
                        participationChange,
                      )}
                    </p>
                  </div>

                  {/* Attendance Change */}

                  <div>
                    <p className="text-xs text-gray-500">
                      Attendance
                    </p>

                    <p
                      className={`mt-1 font-semibold ${getChangeClass(
                        attendanceChange,
                      )}`}
                    >
                      {formatChange(
                        attendanceChange,
                      )}
                    </p>
                  </div>

                </div>
              </>
            ) : (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Movement data is unavailable.
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  At least two reporting months
                  are required to calculate
                  month-over-month movement.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* Analytics Navigation */}
        {/* ------------------------------------------ */}

        <section className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              PBL Analytics
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Explore detailed program
              performance and identify areas
              requiring attention.
            </p>
          </div>

          <div className="border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">

            {/* Monthly */}

            <Link
              href="/pbl/monthly"
              className="p-6 hover:bg-gray-50 transition border-b lg:border-b-0 lg:border-r border-gray-100"
            >
              <div className="text-2xl mb-3">
                📈
              </div>

              <h3 className="font-semibold text-gray-900">
                Monthly Trends
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View PBL performance over time.
              </p>
            </Link>

            {/* Districts */}

            <Link
              href="/pbl/districts"
              className="p-6 hover:bg-gray-50 transition border-b lg:border-b-0 lg:border-r border-gray-100"
            >
              <div className="text-2xl mb-3">
                🏫
              </div>

              <h3 className="font-semibold text-gray-900">
                District Analysis
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Compare performance across
                districts.
              </p>
            </Link>

            {/* Blocks */}

            <Link
              href="/pbl/blocks"
              className="p-6 hover:bg-gray-50 transition border-b lg:border-b-0 lg:border-r border-gray-100"
            >
              <div className="text-2xl mb-3">
                🏘️
              </div>

              <h3 className="font-semibold text-gray-900">
                Block Analysis
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Analyze block-level
                performance.
              </p>
            </Link>

            {/* Risk */}

            <Link
              href="/pbl/risk"
              className="p-6 hover:bg-gray-50 transition border-b lg:border-b-0 lg:border-r border-gray-100"
            >
              <div className="text-2xl mb-3">
                ⚠️
              </div>

              <h3 className="font-semibold text-gray-900">
                Risk & Exceptions
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Identify districts and blocks
                needing follow-up.
              </p>
            </Link>

            {/* Review */}

            <Link
              href="/pbl/review"
              className="p-6 hover:bg-gray-50 transition"
            >
              <div className="text-2xl mb-3">
                📋
              </div>

              <h3 className="font-semibold text-gray-900">
                Monthly Program Review
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Review achievements, risks,
                trends and priorities.
              </p>
            </Link>

          </div>
        </section>

        {/* ------------------------------------------ */}
        {/* Quick Actions */}
        {/* ------------------------------------------ */}

        <section className="mt-6 mb-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6">

          <h2 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly move from the dashboard to
            the most important monitoring views.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <Link
              href="/pbl/risk"
              className="inline-flex items-center rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition"
            >
              View Risk & Exceptions
            </Link>

            <Link
              href="/pbl/review"
              className="inline-flex items-center rounded-lg bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
            >
              Open Monthly Review
            </Link>

            <Link
              href="/pbl/districts"
              className="inline-flex items-center rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Compare Districts
            </Link>

            <Link
              href="/pbl/blocks"
              className="inline-flex items-center rounded-lg bg-gray-50 border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Analyze Blocks
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}