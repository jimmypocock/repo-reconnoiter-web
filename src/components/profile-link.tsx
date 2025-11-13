"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";

/**
 * Profile link for authenticated users
 */
export function ProfileLink() {
  const { status } = useSession();

  // Only show for authenticated users
  if (status !== "authenticated") {
    return null;
  }

  return (
    <Link
      href="/profile"
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
    >
      <UserCircleIcon className="h-4 w-4" />
      Profile
    </Link>
  );
}
