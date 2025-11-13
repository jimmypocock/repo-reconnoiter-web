/**
 * API Configuration
 * Base URL and helper functions for API calls
 *
 * Calls Next.js API routes which proxy to Rails API with API key
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Fetch wrapper with error handling
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
