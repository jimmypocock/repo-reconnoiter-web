"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChartBarIcon } from "@heroicons/react/24/outline";

/**
 * Admin Stats link for admin users
 */
export function AdminStatsLink() {
  const { data: session, status } = useSession();

  // Only show for authenticated admin users
  if (status !== "authenticated" || !session?.user?.admin) {
    return null;
  }

  return (
    <Link
      href="/admin/stats"
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    >
      <ChartBarIcon className="h-4 w-4" />
      Stats
    </Link>
  );
}
