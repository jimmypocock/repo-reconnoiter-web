"use client";

import { useSession } from "next-auth/react";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

/**
 * Mission Control link for admins
 * Uses session exchange to authenticate with Rails backend
 */
export function MissionControlLink() {
  const { data: session, status } = useSession();

  // Only show for authenticated admin users
  if (status !== "authenticated" || !session?.user?.admin || !session?.railsJwt) {
    return null;
  }

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://api.reporeconnoiter.com"
      : "http://localhost:3001";

  const missionControlUrl = `${baseUrl}/session_exchange?token=${session.railsJwt}&redirect=/admin/jobs`;

  return (
    <a
      href={missionControlUrl}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      target="_blank"
      rel="noopener noreferrer"
    >
      <WrenchScrewdriverIcon className="h-4 w-4" />
      Mission Control
    </a>
  );
}
