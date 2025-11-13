import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_URL = process.env.REPO_RECONNOITER_API_URL;
const API_KEY = process.env.API_KEY;

/**
 * GET /comparisons/status/:sessionId
 * Poll for comparison status (fallback when WebSocket is unavailable)
 * Requires user authentication (JWT)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // Get the session for user JWT
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.railsJwt) {
      return NextResponse.json(
        {
          error: {
            message: "User authentication required",
            details: ["You must be signed in to check comparison status"],
          },
        },
        { status: 401 }
      );
    }

    // Get session ID from params
    const { sessionId } = await params;

    console.log("Checking status for session:", sessionId);

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
    const response = await fetch(`${API_URL}/comparisons/status/${sessionId}`, {
      method: "GET",
      headers,
      cache: "no-store", // Disable caching for fresh status
    });

    // Get response data
    const data = await response.json();

    // Return response with same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error checking comparison status:", error);
    return NextResponse.json(
      {
        error: {
          message: "Failed to check comparison status",
          details: ["An unexpected error occurred"],
        },
      },
      { status: 500 }
    );
  }
}
