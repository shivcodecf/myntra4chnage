"use client";

import { useEffect, useMemo, useState } from "react";

import api from "@/lib/api";

interface PBLBlock {
  block: string;
  district: string;
  totalSchools: number;
  participatingSchools: number;
  participationPercentage: number;
  evidenceSchools: number;
  evidenceSubmissionPercentage: number;
  totalEnrollment: number;
  totalAttendance: number;
  attendancePercentage: number;
  overallScore: number;
  riskStatus: string;
}

interface PBLBlockResponse {
  success: boolean;
  data: PBLBlock[];
}

const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

export default function PBLBlocksPage() {
  const [blocks, setBlocks] = useState<PBLBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await api.get<PBLBlockResponse>("/pbl/blocks");

        console.log("Block API response:", response.data);

        if (response.data.success) {
          setBlocks(response.data.data);
        } else {
          setError("Failed to load block data");
        }
      } catch (error) {
        console.error("Block API error:", error);
        setError("Failed to load block data");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const districts = useMemo(() => {
    return Array.from(new Set(blocks.map((item) => item.district))).sort();
  }, [blocks]);

  const filteredBlocks = useMemo(() => {
    return blocks.filter((item) => {
      const matchesSearch = item.block
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDistrict =
        districtFilter === "All" || item.district === districtFilter;

      const matchesRisk =
        riskFilter === "All" || item.riskStatus === riskFilter;

      return matchesSearch && matchesDistrict && matchesRisk;
    });
  }, [blocks, search, districtFilter, riskFilter]);

  const onTrackCount = blocks.filter(
    (item) => item.riskStatus === "On Track",
  ).length;

  const atRiskCount = blocks.filter(
    (item) => item.riskStatus === "At Risk",
  ).length;

  const behindCount = blocks.filter(
    (item) => item.riskStatus === "Behind",
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading block analysis...</p>
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
            Block Analysis
          </h1>

          <p className="mt-2 text-gray-600">
            Compare PBL performance across blocks and districts.
          </p>
        </div>

        {/* Summary */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">On Track</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {onTrackCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">blocks</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">At Risk</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {atRiskCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">blocks need attention</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500">Behind</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {behindCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              blocks below expectations
            </p>
          </div>
        </div>

        {/* Filters */}

        <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}

            <div>
              <label
                htmlFor="block-search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Block
              </label>

              <input
                id="block-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search block..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* District */}

            <div>
              <label
                htmlFor="district-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                District
              </label>

              <select
                id="district-filter"
                value={districtFilter}
                onChange={(event) => setDistrictFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Districts</option>

                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
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
                onChange={(event) => setRiskFilter(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All</option>
                <option value="On Track">On Track</option>
                <option value="Behind">Behind</option>
                <option value="At Risk">At Risk</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-900">
              {filteredBlocks.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900">{blocks.length}</span>{" "}
            blocks
          </p>
        </div>

        {/* Table */}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Block Performance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Block-wise participation, evidence, attendance and overall
              performance.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-gray-700">
                      Block
                    </th>

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
                  {filteredBlocks.map((item) => (
                    <tr
                      key={`${item.district}-${item.block}`}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 font-medium text-gray-900">
                        {item.block}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.district}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.totalSchools.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.participatingSchools.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {formatPercentage(item.participationPercentage)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.evidenceSchools.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {formatPercentage(item.evidenceSubmissionPercentage)}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.totalEnrollment.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {item.totalAttendance.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {formatPercentage(item.attendancePercentage)}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {formatPercentage(item.overallScore)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            item.riskStatus === "On Track"
                              ? "bg-green-100 text-green-700"
                              : item.riskStatus === "Behind"
                                ? "bg-orange-100 text-orange-700"
                                : item.riskStatus === "At Risk"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.riskStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBlocks.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-gray-500">No blocks match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
