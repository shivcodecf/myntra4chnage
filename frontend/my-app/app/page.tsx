"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { GrantOverview, GrantOverviewResponse } from "@/types/grant";
import Link from "next/link";

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

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Grant Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Overview of grants, budget utilization and risk status.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {grants.map((grant) => (
            <Link
              key={grant.grantId}
              href={`/grants/${grant.grantId}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{grant.donor}</p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    {grant.grantName}
                  </h2>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
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

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Approved Budget</p>

                  <p className="text-xl text-black font-semibold">
                    {grant.totalApprovedBudget}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Utilized</p>

                  <p className="text-xl text-black font-semibold">
                    {grant.totalUtilized}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Utilization</span>

                    <span className="font-medium">
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

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">Latest reporting month</p>

                <p className="text-sm text-black font-medium text-gray-800">
                  {grant.latestReportingMonth}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
