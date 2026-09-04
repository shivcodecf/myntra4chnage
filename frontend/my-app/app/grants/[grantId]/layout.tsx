import Link from "next/link";

export default async function GrantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ grantId: string }>;
}) {
  const { grantId } = await params;

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back */}
        <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>

        {/* Grant Header */}
        <div className="mt-8">
          <p className="text-sm text-gray-500">Grant</p>

          <h1 className="text-3xl font-bold text-gray-900">{grantId}</h1>

          <p className="mt-2 text-gray-600">
            Grant performance, finance and evidence overview.
          </p>
        </div>

        {/* Tabs */}
        <nav className="mt-8 border-b border-gray-200">
          <div className="flex gap-6">
            <Link
              href={`/grants/${grantId}`}
              className="pb-4 text-sm text-gray-600 hover:text-blue-600"
            >
              Overview
            </Link>

            <Link
              href={`/grants/${grantId}/performance`}
              className="pb-4 text-sm text-gray-600 hover:text-blue-600"
            >
              Performance
            </Link>

            <Link
              href={`/grants/${grantId}/finance`}
              className="pb-4 text-sm text-gray-600 hover:text-blue-600"
            >
              Finance
            </Link>

            <Link
              href={`/grants/${grantId}/evidence`}
              className="pb-4 text-sm text-gray-600 hover:text-blue-600"
            >
              Evidence & Media
            </Link>

            <Link
              href={`/grants/${grantId}/report`}
              className="pb-4 text-sm text-gray-600 hover:text-blue-600"
            >
              Report
            </Link>
          </div>
        </nav>

        {/* Child page */}
        <div className="pt-8">{children}</div>
      </div>
    </main>
  );
}
