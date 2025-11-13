import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_URL = process.env.REPO_RECONNOITER_API_URL;
const API_KEY = process.env.API_KEY;

/**
 * GET /comparisons/:id
 * Fetch a single comparison by ID
 */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Get user session (if authenticated)
    const session = await getServerSession(authOptions);

    // Get comparison ID from params
    const { id } = await params;

    // Prepare headers with User-Agent (required for Cloudflare)
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (compatible; RepoReconnoiter/1.0)",
      Accept: "application/json",
    };

    // Add API key (app-level authentication)
    if (API_KEY) {
      headers["Authorization"] = `Bearer ${API_KEY}`;
    }

    // Add user JWT token if user is authenticated (user-level authentication)
    if (session?.railsJwt) {
      headers["X-User-Token"] = session.railsJwt;
    }

    // Fetch from Rails API
    const response = await fetch(`${API_URL}/comparisons/${id}`, {
      method: "GET",
      headers,
      cache: "no-store", // Disable caching for fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Backend API error: ${response.status} ${response.statusText}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch comparison",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
