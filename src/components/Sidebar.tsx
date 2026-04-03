"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="bg-gray-900 p-5 w-64 h-screen text-white">
      <h1 className="mb-8 font-bold text-2xl">VAT System</h1>

      <nav className="space-y-4">
        <Link href="/dashboard" className="block hover:text-blue-400">
          Dashboard
        </Link>

        <Link href="/purchase" className="block hover:text-blue-400">
          Purchase
        </Link>

        <Link href="/sales" className="block hover:text-blue-400">
          Sales
        </Link>

        <Link href="/stock" className="block hover:text-blue-400">
          Stock
        </Link>

        <Link href="/vat" className="block hover:text-blue-400">
          VAT Dashboard
        </Link>

        <Link href="/reports/purchase" className="block hover:text-blue-400">
          Purchase Report
        </Link>

        <Link href="/reports/sales" className="block hover:text-blue-400">
          Sales Report
        </Link>
      </nav>
    </div>
  );
}
