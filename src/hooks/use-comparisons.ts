import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ComparisonsResponse, ComparisonsParams } from "@/types/api";

/**
 * Hook to fetch paginated comparisons
 */
export function useComparisons(params: ComparisonsParams = {}) {
  const { page = 1, per_page = 10, ...otherParams } = params;

  return useQuery({
    queryKey: ["comparisons", { page, per_page, ...otherParams }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("page", page.toString());
      searchParams.set("per_page", per_page.toString());

      if (otherParams.search) searchParams.set("search", otherParams.search);
      if (otherParams.date) searchParams.set("date", otherParams.date);
      if (otherParams.sort) searchParams.set("sort", otherParams.sort);

      return apiFetch<ComparisonsResponse>(`/comparisons?${searchParams.toString()}`);
    },
  });
}
