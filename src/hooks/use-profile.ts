import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ProfileResponse } from "@/types/api";

/**
 * Hook to fetch current user's profile
 * Requires authentication
 */
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return apiFetch<ProfileResponse>("/profile");
    },
  });
}
