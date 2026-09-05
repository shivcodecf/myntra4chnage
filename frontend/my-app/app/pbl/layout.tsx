"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PBLLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/pbl" },
    { name: "Review", href: "/pbl/review" },
    { name: "Districts", href: "/pbl/districts" },
    { name: "Blocks", href: "/pbl/blocks" },
    { name: "Monthly", href: "/pbl/monthly" },
    { name: "Trends", href: "/pbl/trends" },
    { name: "Movement", href: "/pbl/movement" },
    { name: "Risk", href: "/pbl/risk" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            {/* Top Header */}
            <div className="flex min-h-16 flex-col justify-center gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
              {/* Main Dashboard */}
              <Link
                href="/"
                className="w-fit whitespace-nowrap text-sm font-medium text-gray-600 transition hover:text-blue-600"
              >
                ← Main Dashboard
              </Link>

              {/* Dashboard Name */}
              <Link
                href="/pbl"
                className="w-fit whitespace-nowrap text-lg font-bold text-gray-900 sm:mr-auto"
              >
                PBL Dashboard
              </Link>

              {/* Navigation Links - Desktop */}
              <div className="hidden items-center gap-1 lg:flex">
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

            {/* Navigation Links - Mobile / Tablet */}
            <div className="flex overflow-x-auto border-t border-gray-100 py-2 lg:hidden">
              <div className="flex min-w-max items-center gap-1">
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
        </div>
      </nav>

      {/* Page Content */}
      {children}
    </div>
  );
}