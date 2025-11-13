"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

/**
 * Authentication Button
 * Shows "Sign in with GitHub" when not authenticated
 * Shows user info and sign out button when authenticated
 */
export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <img
            src={session.user.avatar_url}
            alt={session.user.github_username}
            className="h-8 w-8 rounded-full"
          />
          <span className="text-sm font-medium">
            {session.user.github_username}
          </span>
          {session.user.admin && (
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Admin
            </span>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("github")}
      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
    >
      Sign in with GitHub
    </button>
  );
}
