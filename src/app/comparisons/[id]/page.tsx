"use client";

import { use } from "react";
import Link from "next/link";
import { useComparison } from "@/hooks/use-comparison";
import { ArrowLeftIcon, StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ComparisonPage({ params }: PageProps) {
  const { id } = use(params);
  const { data, isLoading, error } = useComparison(id);

  if (isLoading) {
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
            <h3 className="font-semibold text-red-900 dark:text-red-200">
              Error loading comparison
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {error?.message || "Comparison not found"}
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

  const comparison = data.data;
  const recommendedRepo = comparison.repositories.find(
    (repo) => repo.full_name === comparison.recommended_repo
  );
  const otherRepos = comparison.repositories.filter(
    (repo) => repo.full_name !== comparison.recommended_repo
  );

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
            Back to Comparisons
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Query Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-100">
            {comparison.user_query}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {comparison.categories.map((category) => (
              <span
                key={category.id}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {category.name}
              </span>
            ))}
          </div>
          <div className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            <p>
              <strong>Technologies:</strong> {comparison.technologies || "N/A"}
            </p>
            <p>
              <strong>Problem Domains:</strong> {comparison.problem_domains || "N/A"}
            </p>
            {comparison.architecture_patterns && (
              <p>
                <strong>Architecture Patterns:</strong> {comparison.architecture_patterns}
              </p>
            )}
          </div>
        </div>

        {/* Recommended Repository */}
        {recommendedRepo && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <StarIconSolid className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-100">Recommended</h2>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-zinc-100">
                    <a
                      href={recommendedRepo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {recommendedRepo.full_name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                    {recommendedRepo.description || "No description available"}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4" />
                      {recommendedRepo.stargazers_count.toLocaleString()}
                    </div>
                    {recommendedRepo.language && (
                      <div className="rounded-full bg-slate-200 px-2 py-1 text-xs dark:bg-zinc-700">
                        {recommendedRepo.language}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Repositories */}
        {otherRepos.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-zinc-100">
              Other Options Analyzed
            </h2>
            <div className="space-y-4">
              {otherRepos.map((repo) => (
                <div
                  key={repo.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {repo.full_name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                    {repo.description || "No description available"}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4" />
                      {repo.stargazers_count.toLocaleString()}
                    </div>
                    {repo.language && (
                      <div className="rounded-full bg-slate-200 px-2 py-1 text-xs dark:bg-zinc-700">
                        {repo.language}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 border-t border-slate-200 pt-8 text-sm text-slate-600 dark:border-zinc-800 dark:text-zinc-400">
          <p>
            {comparison.repos_compared_count} repositories analyzed • {comparison.view_count} views
          </p>
        </div>
      </main>
    </div>
  );
}
