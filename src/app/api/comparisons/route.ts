import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.REPO_RECONNOITER_API_URL;
const API_KEY = process.env.API_KEY;

/**
 * GET /comparisons
 * Proxy to backend API with API key authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Forward query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${API_URL}/comparisons${queryString ? `?${queryString}` : ""}`;

    // Prepare headers with User-Agent (required for Cloudflare)
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; RepoReconnoiter/1.0)",
      "Accept": "application/json",
    };

    // Add API key if available
    if (API_KEY) {
      headers["Authorization"] = `Bearer ${API_KEY}`;
    }

    // Debug logging
    console.log("=== API Route Debug ===");
    console.log("Target URL:", url);
    console.log("API_KEY exists:", !!API_KEY);
    console.log("API_KEY length:", API_KEY?.length);
    console.log("Headers:", JSON.stringify(headers, null, 2));

    // Fetch from Rails API
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Disable caching for fresh data
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Backend API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comparisons", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
