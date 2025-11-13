import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ComparisonResponse } from "@/types/api";

/**
 * Hook to fetch a single comparison by ID
 */
export function useComparison(id: string) {
  return useQuery({
    queryKey: ["comparison", id],
    queryFn: async () => {
      return apiFetch<ComparisonResponse>(`/comparisons/${id}`);
    },
    enabled: !!id,
  });
}
