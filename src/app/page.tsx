"use client";

import { useState } from "react";
import Image from "next/image";
import { useComparisons } from "@/hooks/use-comparisons";
import { ComparisonCard } from "@/components/comparison-card";
import { ComparisonCreate } from "@/components/comparison-create";
import { ComparisonSearch } from "@/components/comparison-search";
import { Pagination } from "@/components/pagination";
import { AuthButton } from "@/components/auth-button";
import { ProfileLink } from "@/components/profile-link";
import { AdminStatsLink } from "@/components/admin-stats-link";
import { MissionControlLink } from "@/components/mission-control-link";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useComparisons({
    page: currentPage,
    per_page: 10,
    search: searchQuery || undefined,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Logo */}
              <Image
                src="/logo.svg"
                alt="Repo Reconnoiter Logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  Repo Reconnoiter
                </h1>
                <p className="mt-1 text-sm text-blue-600 dark:text-zinc-400">
                  AI-Powered Open Source Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ProfileLink />
              <AdminStatsLink />
              <MissionControlLink />
              <AuthButton />
            </div>
          </div>
          <p className="mt-4 text-lg text-slate-600 dark:text-zinc-300">
            Discover, analyze, and compare GitHub repositories to make better tech stack decisions.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Comparison Create - Only visible when authenticated */}
        <ComparisonCreate />

        {/* Search existing comparisons - Always visible */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-zinc-100">
            Browse Comparisons
          </h2>
          <ComparisonSearch onSearch={handleSearch} initialValue={searchQuery} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-600 dark:border-zinc-800 dark:border-t-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
            <h3 className="font-semibold text-red-900 dark:text-red-200">
              Error loading comparisons
            </h3>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error.message}</p>
          </div>
        )}

        {/* Comparisons List */}
        {data && (
          <>
            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-zinc-400">
                {searchQuery
                  ? `Found ${data.meta.pagination.total_count} result${data.meta.pagination.total_count === 1 ? "" : "s"}`
                  : `${data.meta.pagination.total_count} total comparison${data.meta.pagination.total_count === 1 ? "" : "s"}`}
              </p>
            </div>

            <div className="space-y-6">
              {data.data.length === 0 ? (
                <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {searchQuery
                      ? `No comparisons found matching "${searchQuery}".`
                      : "No comparisons found."}
                  </p>
                </div>
              ) : (
                data.data.map((comparison) => (
                  <ComparisonCard key={comparison.id} comparison={comparison} />
                ))
              )}
            </div>

            {/* Pagination */}
            {data.meta.pagination.total_pages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={data.meta.pagination.total_pages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Repo Reconnoiter. AI-powered repository analysis.
          </p>
        </div>
      </footer>
    </div>
  );
}
