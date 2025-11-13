"use client";

import { useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useComparisonCreate } from "@/hooks/use-comparison-create";
import { ComparisonProgress } from "@/components/comparison-progress";

/**
 * Search form for creating new comparisons with real-time progress updates
 */
export function ComparisonCreate() {
  const { status } = useSession();
  const [query, setQuery] = useState("");
  const { createComparison, progress, isCreating, error, cancel } = useComparisonCreate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim()) return;

    await createComparison(query.trim());
  };

  // Don't render anything if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  // Show progress if currently creating
  if (isCreating) {
    return (
      <div className="mb-12 flex justify-center">
        <ComparisonProgress
          step={progress.step}
          message={progress.message}
          percentage={progress.percentage}
          current={progress.current}
          total={progress.total}
          onCancel={cancel}
        />
      </div>
    );
  }

  // Show error if present
  if (error) {
    return (
      <div className="mb-12">
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
          <h3 className="font-semibold text-red-900 dark:text-red-200">Error</h3>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isLoading = status === "loading";

  return (
    <div className="mb-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Find Your Perfect Repository
          </h2>
          <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
            Describe what you&apos;re looking for and let AI find and compare the best GitHub
            repositories for your needs.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="comparison-query"
                  name="query"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Rails background job processor that doesn't require sidekiq"
                  className="w-full rounded-lg border border-neutral-300 bg-white py-3 pr-4 pl-10 text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
                  disabled={isLoading}
                  maxLength={500}
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Search
              </button>
            </div>

            {/* Character Count */}
            <div className="mt-2 text-right text-xs text-neutral-500 dark:text-neutral-400">
              <span>{query.length}/500</span>
            </div>
          </form>

          {/* Example Queries */}
          {!query && (
            <div className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-700">
              <p className="mb-3 text-xs font-medium tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
                Example Queries
              </p>
              <div className="space-y-2">
                {[
                  "React state management library with TypeScript support",
                  "Python web framework for building REST APIs",
                  "JavaScript testing framework with snapshot support",
                ].map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => setQuery(example)}
                    disabled={isLoading}
                    className="block w-full rounded bg-neutral-50 px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
