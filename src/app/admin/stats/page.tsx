"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { toNum } from "@/lib/utils";

export default function AdminStatsPage() {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = useAdminStats();
  const router = useRouter();

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !session?.user?.admin)) {
      router.push("/");
    }
  }, [status, session, router]);

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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
            <h3 className="font-semibold text-red-900 dark:text-red-200">
              Error loading admin statistics
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error?.message || "Failed to load admin statistics"}
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

  const { ai_spending, budget, platform, spend_by_model, spend_by_user } = data.data;

  const budgetStatusColors = {
    healthy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    critical: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    exceeded: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
              Admin Dashboard
            </h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* AI Spending Overview */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">AI Spending</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">Today</div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(ai_spending.today).toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">This Week</div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(ai_spending.this_week).toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                This Month
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(ai_spending.this_month).toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Projected Month
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(ai_spending.projected_month).toFixed(2)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Total All-Time
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(ai_spending.total).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Tracking */}
        <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">
            Monthly Budget
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Monthly Limit
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(budget.monthly_limit).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">Remaining</div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
                ${toNum(budget.remaining).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Percentage Used
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-zinc-100">
                {toNum(budget.percentage_used).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">Status</div>
              <div className="mt-2">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${budgetStatusColors[budget.status]}`}
                >
                  {budget.status.charAt(0).toUpperCase() + budget.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
              <div
                className={`h-full rounded-full transition-all ${
                  budget.status === "healthy"
                    ? "bg-green-600"
                    : budget.status === "warning"
                      ? "bg-yellow-600"
                      : budget.status === "critical"
                        ? "bg-orange-600"
                        : "bg-red-600"
                }`}
                style={{ width: `${Math.min(toNum(budget.percentage_used), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">
            Platform Metrics
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Total Comparisons
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {platform.comparisons_count.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Repositories Analyzed
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {platform.repositories_count.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                Total Views
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {platform.total_views.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Spending by Model */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">
              Spending by Model (This Month)
            </h2>
            {spend_by_model.length === 0 ? (
              <p className="text-slate-600 dark:text-zinc-400">No spending data yet</p>
            ) : (
              <div className="space-y-4">
                {spend_by_model.map((item) => (
                  <div key={item.model}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900 dark:text-zinc-100">
                        {item.model}
                      </span>
                      <span className="text-slate-600 dark:text-zinc-400">
                        ${toNum(item.cost).toFixed(2)} ({toNum(item.percentage).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${toNum(item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spending by User */}
          <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-zinc-100">
              Top Users by Spending (This Month)
            </h2>
            {spend_by_user.length === 0 ? (
              <p className="text-slate-600 dark:text-zinc-400">No spending data yet</p>
            ) : (
              <div className="space-y-4">
                {spend_by_user.map((item) => (
                  <div key={item.username}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900 dark:text-zinc-100">
                        {item.username}
                      </span>
                      <span className="text-slate-600 dark:text-zinc-400">
                        ${toNum(item.cost).toFixed(2)} ({toNum(item.percentage).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                      <div
                        className="h-full rounded-full bg-purple-600"
                        style={{ width: `${toNum(item.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
