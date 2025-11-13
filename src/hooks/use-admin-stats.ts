import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { AdminStatsResponse } from "@/types/api";

/**
 * Hook to fetch platform-wide admin statistics
 * Requires authentication + admin role
 */
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      return apiFetch<AdminStatsResponse>("/admin/stats");
    },
  });
}
