"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/api";

interface FinanceSummary {
  approvedBudget: number;
  utilized: number;
  utilizationRate: number;
}

interface FinanceMonth {
  reportingMonth: string;
  approvedBudget: number;
  utilized: number;
  utilizationRate: number;
}

interface BudgetLine {
  reportingMonth: string;
  budgetLine: string;
  approvedBudget: number;
  utilized: number;
  cumulativeUtilized: number;
  cumulativeUtilizationRate: number;
  financeNote: string;
}

interface GrantFinanceResponse {
  success: boolean;
  data: {
    grantId: string;
    summary: FinanceSummary;
    months: FinanceMonth[];
    budgetLines: BudgetLine[];
  };
}

const formatAmount = (value: number) => {
  return new Intl.NumberFormat("en-IN").format(value);
};

export default function GrantFinancePage() {
  const params = useParams();

  const grantId = params.grantId as string;

  const [summary, setSummary] =
    useState<FinanceSummary | null>(null);

  const [months, setMonths] =
    useState<FinanceMonth[]>([]);

  const [budgetLines, setBudgetLines] =
    useState<BudgetLine[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<GrantFinanceResponse>(
            `/grants/${grantId}/finance`
          );

        if (response.data.success) {
          setSummary(
            response.data.data.summary
          );

          setMonths(
            response.data.data.months
          );

          setBudgetLines(
            response.data.data.budgetLines
          );
        } else {
          setError("Failed to load finance data.");
        }
      } catch (error) {
        console.error(
          "Finance API error:",
          error
        );

        setError(
          "Failed to load finance data."
        );
      } finally {
        setLoading(false);
      }
    };

    if (grantId) {
      fetchFinance();
    }
  }, [grantId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-600">
          Loading finance data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-gray-600">
          No finance data available.
        </p>
      </div>
    );
  }

  const utilizationPercentage =
    summary.utilizationRate * 100;

  return (
    <div className="space-y-8">

      {/* Page Header */}

      <section>
        <p className="text-sm font-medium text-blue-600">
          Financial Management
        </p>

        <h2 className="mt-1 text-2xl font-bold text-gray-900">
          Grant Finance
        </h2>

        <p className="mt-2 text-gray-600">
          Track approved budget, utilization and
          monthly financial performance.
        </p>
      </section>

      {/* Summary Cards */}

      <section>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          {/* Approved Budget */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Approved Budget
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₹{formatAmount(summary.approvedBudget)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Total approved grant amount
            </p>
          </div>

          {/* Utilized */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Utilized
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              ₹{formatAmount(summary.utilized)}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Amount utilized so far
            </p>
          </div>

          {/* Utilization */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Utilization Rate
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {utilizationPercentage.toFixed(1)}%
            </p>

            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(
                      utilizationPercentage,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>0%</span>

                <span>100%</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Monthly Finance */}

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Finance
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Monthly approved budget and utilization.
          </p>
        </div>

        {months.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No monthly finance records found.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">

                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Reporting Month
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Approved Budget
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Utilized
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Utilization
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {months.map((month) => (
                    <tr
                      key={month.reportingMonth}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {month.reportingMonth}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        ₹
                        {formatAmount(
                          month.approvedBudget
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        ₹
                        {formatAmount(
                          month.utilized
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{
                                width: `${Math.min(
                                  month.utilizationRate *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="font-medium text-gray-700">
                            {(
                              month.utilizationRate *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </section>

      {/* Budget Line Breakdown */}

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Budget Line Breakdown
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Detailed utilization by budget category.
          </p>
        </div>

        {budgetLines.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-gray-500">
              No budget line records found.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">

                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Month
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Budget Line
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Approved
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Utilized
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Cumulative Utilized
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Cumulative %
                    </th>

                    <th className="px-6 py-4 font-semibold text-gray-700">
                      Finance Note
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {budgetLines.map(
                    (line, index) => (
                      <tr
                        key={`${line.reportingMonth}-${line.budgetLine}-${index}`}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {line.reportingMonth}
                        </td>

                        <td className="px-6 py-4 text-gray-700">
                          {line.budgetLine}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          ₹
                          {formatAmount(
                            line.approvedBudget
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          ₹
                          {formatAmount(
                            line.utilized
                          )}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          ₹
                          {formatAmount(
                            line.cumulativeUtilized
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-700">
                            {(
                              line.cumulativeUtilizationRate *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </td>

                        <td className="max-w-xs px-6 py-4 text-gray-600">
                          {line.financeNote || "—"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </section>

      {/* Finance Summary */}

      <section>
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
          <h3 className="font-semibold text-gray-900">
            Finance Summary
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-500">
                Approved
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                ₹{formatAmount(summary.approvedBudget)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Utilized
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                ₹{formatAmount(summary.utilized)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Remaining
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                ₹
                {formatAmount(
                  Math.max(
                    summary.approvedBudget -
                      summary.utilized,
                    0
                  )
                )}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}