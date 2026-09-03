"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import api from "@/lib/api";
import {
  GrantEvidenceRecord,
  GrantEvidenceResponse,
} from "@/types/grant";

export default function EvidencePage() {
  const params = useParams();
  const grantId = params.grantId as string;

  const [evidence, setEvidence] = useState<GrantEvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const response = await api.get<GrantEvidenceResponse>(
          `/grants/${grantId}/evidence`
        );

        if (response.data.success) {
          setEvidence(response.data.data.records);
          console.log("Evidence API response:", response.data);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load evidence and media");
      } finally {
        setLoading(false);
      }
    };

    fetchEvidence();
  }, [grantId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">
            Loading evidence and media...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <p className="text-sm text-blue-600">
            Supporting Materials
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            Evidence & Media
          </h1>

          <p className="mt-2 text-gray-600">
            Supporting evidence, media records and reporting materials.
          </p>
        </div>

        {/* Empty State */}
        {evidence.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-600">
              No evidence or media records available.
            </p>
          </div>
        )}

        {/* Evidence Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evidence.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {/* Media Preview */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <div className="text-center">

                  <div className="text-4xl mb-2">
                    {item.mediaType === "image"
                      ? "🖼️"
                      : "📰"}
                  </div>

                  <p className="text-sm text-gray-500">
                    {item.mediaType}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">

                {/* Type + Month */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    {item.mediaType}
                  </span>

                  <span className="text-xs text-gray-500">
                    {item.reportingMonth}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h2>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 leading-6">
                  {item.description}
                </p>

                {/* District */}
                <div className="mt-5">
                  <p className="text-xs text-gray-500">
                    District
                  </p>

                  <p className="text-sm text-gray-800 mt-1">
                    {item.district}
                  </p>
                </div>

                {/* File */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    File
                  </p>

                  <p className="text-sm text-gray-800 mt-1 break-all">
                    {item.fileName}
                  </p>
                </div>

                {/* Usage Note */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Usage Note
                  </p>

                  <p className="text-sm text-gray-700 mt-1">
                    {item.usageNote}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}