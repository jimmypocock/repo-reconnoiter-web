import { NextRequest, NextResponse } from "next/server";

const RAILS_API_URL = process.env.RAILS_API_URL || "http://localhost:3000/api/v1";
const API_KEY = process.env.API_KEY;

/**
 * GET /api/comparisons
 * Proxy to Rails API with API key authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Forward query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${RAILS_API_URL}/comparisons${queryString ? `?${queryString}` : ""}`;

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add API key if available
    if (API_KEY) {
      headers["Authorization"] = `Bearer ${API_KEY}`;
    }

    // Fetch from Rails API
    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Disable caching for fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Rails API error: ${response.status} ${response.statusText}`, details: errorText },
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
