import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const API_URL = process.env.REPO_RECONNOITER_API_URL;
const API_KEY = process.env.API_KEY;

if (!API_URL || !API_KEY) {
  throw new Error("Missing required environment variables: REPO_RECONNOITER_API_URL, API_KEY");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * Called after successful sign in
     * Exchange GitHub access token for Rails JWT
     */
    async jwt({ token, account }) {
      // On initial sign in, account will contain the GitHub access token
      if (account?.access_token) {
        try {
          // Exchange GitHub token for Rails JWT
          const response = await fetch(`${API_URL}/auth/exchange`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_KEY}`,
              "User-Agent": "Mozilla/5.0 (compatible; RepoReconnoiter/1.0)",
              Accept: "application/json",
            },
            body: JSON.stringify({
              github_token: account.access_token,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to exchange GitHub token:", errorText);
            throw new Error(`JWT exchange failed: ${response.status}`);
          }

          const data = await response.json();

          // Store Rails JWT and user data in the token
          token.railsJwt = data.data.jwt;
          token.user = data.data.user;
        } catch (error) {
          console.error("Error exchanging GitHub token:", error);
          // Don't throw - let user continue but mark as unauthorized
          token.error = "JWT_EXCHANGE_FAILED";
        }
      }

      return token;
    },

    /**
     * Called whenever session is checked
     * Expose user data and JWT to the client session
     */
    async session({ session, token }) {
      if (token.error) {
        // Pass error to client
        session.error = token.error as string;
      }

      if (token.user) {
        // Add user data to session
        session.user = token.user;
      }

      if (token.railsJwt) {
        // Add Rails JWT to session (will be used by API routes)
        session.railsJwt = token.railsJwt as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home page for sign in
    error: "/auth/error", // Error page
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours to match Rails JWT expiry
  },
};
