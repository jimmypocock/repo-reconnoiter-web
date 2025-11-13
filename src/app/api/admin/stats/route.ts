import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_URL = process.env.REPO_RECONNOITER_API_URL;
const API_KEY = process.env.API_KEY;

/**
 * GET /admin/stats
 * Get platform-wide statistics (admin only)
 * Requires user authentication (JWT) + admin role
 */
export async function GET() {
  try {
    // Get the session for user JWT
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.railsJwt) {
      return NextResponse.json(
        {
          error: {
            message: "User authentication required",
            details: ["You must be signed in to view admin statistics"],
          },
        },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!session?.user?.admin) {
      return NextResponse.json(
        {
          error: {
            message: "Admin access required",
            details: ["You must be an admin to access this endpoint"],
          },
        },
        { status: 403 }
      );
    }

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

    // Add user JWT token (user-level authentication)
    headers["X-User-Token"] = session.railsJwt;

    // Fetch from Rails API
    const response = await fetch(`${API_URL}/admin/stats`, {
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
        error: "Failed to fetch admin statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
