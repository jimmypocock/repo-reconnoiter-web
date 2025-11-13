"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useProfile } from "@/hooks/use-profile";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { toNum } from "@/lib/utils";

export default function ProfilePage() {
  const { status } = useSession();
  const { data, isLoading, error } = useProfile();
  const router = useRouter();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600 dark:border-zinc-800 dark:border-t-blue-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
            <h3 className="font-semibold text-red-900 dark:text-red-200">Error loading profile</h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error?.message || "Failed to load profile data"}
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { user, stats, recent_comparisons, recent_analyses } = data.data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* User Info */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <Image
              src={user.github_avatar_url}
              alt={user.github_username}
              width={80}
              height={80}
              className="h-20 w-20 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
                {user.github_username}
              </h1>
              <p className="text-sm text-slate-600 dark:text-zinc-400">{user.email}</p>
              {user.admin && (
                <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">
            Usage Statistics
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Comparisons This Month
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {stats.comparisons_this_month}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Remaining Today
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {stats.remaining_comparisons_today === Infinity
                  ? "∞"
                  : stats.remaining_comparisons_today}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Total AI Cost
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(stats.total_cost_spent).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Comparisons */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">
            Recent Comparisons
          </h2>
          {recent_comparisons.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-slate-600 dark:text-zinc-400">
                No comparisons yet. Create your first one!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recent_comparisons.map((comparison) => (
                <Link
                  key={comparison.id}
                  href={`/comparisons/${comparison.id}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-blue-200 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-zinc-100">
                        {comparison.user_query}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-600 dark:text-zinc-400">
                        <span>{comparison.repos_compared_count} repos compared</span>
                        <span>•</span>
                        <span>
                          {new Date(comparison.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Analyses */}
        {recent_analyses.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">
              Recent Deep Analyses
            </h2>
            <div className="space-y-4">
              {recent_analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="rounded-lg border border-slate-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-zinc-100">
                        {analysis.repository_name}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-slate-600 dark:text-zinc-400">
                        <span>Model: {analysis.model_used}</span>
                        <span>•</span>
                        <span>
                          {new Date(analysis.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
