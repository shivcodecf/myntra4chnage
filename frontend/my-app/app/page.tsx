"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import api from "@/lib/api";
import type { GrantOverview, GrantOverviewResponse } from "@/types/grant";

export default function Home() {
  const [grants, setGrants] = useState<GrantOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGrants = async () => {
      try {
        const response = await api.get<GrantOverviewResponse>("/grants");

        if (response.data.success) {
          setGrants(response.data.data);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load grants");
      } finally {
        setLoading(false);
      }
    };

    fetchGrants();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading grants...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  // Dashboard summary calculations
  const totalGrants = grants.length;

  const totalApprovedBudget = grants.reduce(
    (total, grant) => total + grant.totalApprovedBudget,
    0,
  );

  const totalUtilized = grants.reduce(
    (total, grant) => total + grant.totalUtilized,
    0,
  );

  const attentionNeeded = grants.filter(
    (grant) => grant.latestRiskStatus !== "On Track",
  ).length;

  const overallUtilization =
    totalApprovedBudget > 0 ? (totalUtilized / totalApprovedBudget) * 100 : 0;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grant Dashboard</h1>
          <Link
            href="/pbl"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            PBL Dashboard →
          </Link>
          <p className="mt-2 text-gray-600">
            Overview of grants, budget utilization and risk status.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {/* Total Grants */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Grants</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalGrants}
            </p>

            <p className="mt-1 text-sm text-gray-500">Active grants</p>
          </div>

          {/* Approved Budget */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Approved Budget</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalApprovedBudget}
            </p>

            <p className="mt-1 text-sm text-gray-500">Across all grants</p>
          </div>

          {/* Total Utilized */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Total Utilized</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalUtilized}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {overallUtilization.toFixed(1)}% overall utilization
            </p>
          </div>

          {/* Attention Needed */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-sm text-gray-500">Attention Needed</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {attentionNeeded}
            </p>

            <p className="mt-1 text-sm text-gray-500">Grants not on track</p>
          </div>
        </div>

        {/* Grant Cards Section */}
        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Grants</h2>

              <p className="mt-1 text-sm text-gray-600">
                Select a grant to view detailed performance and finance data.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
            {grants.map((grant) => (
              <Link
                key={grant.grantId}
                href={`/grants/${grant.grantId}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{grant.donor}</p>

                    <h2 className="mt-1 text-lg font-semibold text-gray-900">
                      {grant.grantName}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                      grant.latestRiskStatus === "On Track"
                        ? "bg-green-100 text-green-700"
                        : grant.latestRiskStatus === "At Risk"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {grant.latestRiskStatus}
                  </span>
                </div>

                {/* Financial Information */}
                <div className="mt-6 space-y-4">
                  {/* Approved Budget */}
                  <div>
                    <p className="text-sm text-gray-500">Approved Budget</p>

                    <p className="mt-1 text-xl text-black font-semibold">
                      {grant.totalApprovedBudget}
                    </p>
                  </div>

                  {/* Utilized */}
                  <div>
                    <p className="text-sm text-gray-500">Utilized</p>

                    <p className="mt-1 text-xl text-black font-semibold">
                      {grant.totalUtilized}
                    </p>
                  </div>

                  {/* Utilization */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Utilization</span>

                      <span className="font-medium text-gray-700">
                        {(grant.utilizationRate * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${grant.utilizationRate * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Latest Reporting Month */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Latest reporting month
                  </p>

                  <p className="mt-1 text-sm text-gray-800 font-medium">
                    {grant.latestReportingMonth}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
