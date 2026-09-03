"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface GrantNavigationProps {
  grantId: string;
}

export default function GrantNavigation({
  grantId,
}: GrantNavigationProps) {
  const pathname = usePathname();

  const links = [
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
  ];

  return (
    <nav className="mb-8 border-b border-gray-200">
      <div className="flex gap-6 overflow-x-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`pb-3 text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}