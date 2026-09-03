"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PBLLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/pbl" },
    { name: "Districts", href: "/pbl/districts" },
    { name: "Blocks", href: "/pbl/blocks" },
    { name: "Monthly", href: "/pbl/monthly" },
    { name: "Trends", href: "/pbl/trends" },
    { name: "Movement", href: "/pbl/movement" },
    { name: "risk", href: "/pbl/risk" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex h-16 items-center gap-8">
            <Link
              href="/"
              className="whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              ← Main Dashboard
            </Link>

            {/* Dashboard Name */}
            <Link href="/pbl" className="text-lg font-bold text-gray-900">
              PBL Dashboard
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {navigation.map((item) => {
                const isActive =
                  item.href === "/pbl"
                    ? pathname === "/pbl"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}
