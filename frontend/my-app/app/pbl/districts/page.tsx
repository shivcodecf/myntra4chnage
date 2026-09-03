"use client";

import { useEffect, useMemo, useState } from "react";

import api from "@/lib/api";

import type {
  PBLDistrict,
  PBLDistrictResponse,
} from "@/types/pbl";

export default function PBLDistrictsPage() {
  const [districts, setDistricts] = useState<PBLDistrict[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response =
          await api.get<PBLDistrictResponse>(
            "/pbl/districts"
          );

        console.log(
          "District API response:",
          response.data
        );

        if (response.data.success) {
          setDistricts(response.data.data);
        } else {
          setError("Failed to load district data");
        }
      } catch (error) {
        console.error("District API error:", error);
        setError("Failed to load district data");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  const filteredDistricts = useMemo(() => {
    return districts.filter((district) => {
      const matchesSearch =
        district.district
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRisk =
        riskFilter === "All" ||
        district.riskStatus === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [districts, search, riskFilter]);

  const riskCount = {
    onTrack: districts.filter(
      (item) => item.riskStatus === "On Track"
    ).length,

    atRisk: districts.filter(
      (item) => item.riskStatus === "At Risk"
    ).length,

    behind: districts.filter(
      (item) => item.riskStatus === "Behind"
    ).length,
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">
            Loading district analysis...
          </p>
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
          <p className="text-sm font-medium text-blue-600">
            PBL Analytics
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            District Analysis
          </h1>

          <p className="mt-2 text-gray-600">
            Compare PBL participation, evidence submission
            and attendance across districts.
          </p>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* On Track */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">
              On Track
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {riskCount.onTrack}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              districts
            </p>
          </div>

          {/* At Risk */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">
              At Risk
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {riskCount.atRisk}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              districts need attention
            </p>
          </div>

          {/* Behind */}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">
              Behind
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {riskCount.behind}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              districts below expectations
            </p>
          </div>

        </div>

        {/* Filters */}

        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Search */}

            <div>
              <label
                htmlFor="district-search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search District
              </label>

              <input
                id="district-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search district..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Risk */}

            <div>
              <label
                htmlFor="risk-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Risk Status
              </label>

              <select
                id="risk-filter"
                value={riskFilter}
                onChange={(event) =>
                  setRiskFilter(event.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All</option>
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Behind">Behind</option>
              </select>
            </div>

          </div>

          <div className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {filteredDistricts.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">
              {districts.length}
            </span>{" "}
            districts
          </div>
        </div>

        {/* District Table */}

        <div className="mt-8">

          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              District Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              District-wise PBL performance and risk status.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1200px] text-left text-sm">

                <thead className="bg-gray-50 border-b border-gray-200">

                  <tr>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      District
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Schools
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Participating
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Participation
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Evidence
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Evidence %
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Enrollment
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Attendance
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Attendance %
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Score
                    </th>

                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredDistricts.map((district) => {

                    const participation =
                      district.participationPercentage * 100;

                    const evidence =
                      district.evidenceSubmissionPercentage * 100;

                    const attendance =
                      district.attendancePercentage * 100;

                    const score =
                      district.overallScore * 100;

                    return (
                      <tr
                        key={district.district}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >

                        <td className="px-5 py-4 font-medium text-gray-900">
                          {district.district}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {district.totalSchools.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {district.participatingSchools.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 font-medium text-gray-700">
                          {participation.toFixed(1)}%
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {district.evidenceSchools.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 font-medium text-gray-700">
                          {evidence.toFixed(1)}%
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {district.totalEnrollment.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {district.totalAttendance.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 font-medium text-gray-700">
                          {attendance.toFixed(1)}%
                        </td>

                        <td className="px-5 py-4 font-medium text-gray-700">
                          {score.toFixed(1)}%
                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              district.riskStatus === "On Track"
                                ? "bg-green-100 text-green-700"
                                : district.riskStatus === "At Risk"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {district.riskStatus}
                          </span>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

            {filteredDistricts.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-gray-500">
                  No districts match your filters.
                </p>
              </div>
            )}

          </div>
        </div>

      </div>
    </main>
  );
}