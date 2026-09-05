import Link from "next/link";

export default async function GrantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ grantId: string }>;
}) {
  const { grantId } = await params;

  const tabs = [
    {
      name: "Overview",
      href: `/grants/${grantId}`,
    },
    {
      name: "Performance",
      href: `/grants/${grantId}/performance`,
    },
    {
      name: "Finance",
      href: `/grants/${grantId}/finance`,
    },
    {
      name: "Evidence & Media",
      href: `/grants/${grantId}/evidence`,
    },
    {
      name: "Report",
      href: `/grants/${grantId}/report`,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Back */}
        <Link
          href="/"
          className="inline-block text-sm font-medium text-blue-600 transition hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>

        {/* Grant Header */}
        <div className="mt-6 sm:mt-8">
          <p className="text-sm text-gray-500">
            Grant
          </p>

          <h1 className="mt-1 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
            {grantId}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Grant performance, finance and evidence overview.
          </p>
        </div>

        {/* Tabs */}
        <nav className="mt-6 border-b border-gray-200 sm:mt-8">
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-2 sm:gap-6">
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-600 transition hover:text-blue-600 sm:px-1 sm:py-4"
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Child page */}
        <div className="pt-6 sm:pt-8">
          {children}
        </div>
      </div>
    </main>
  );
}