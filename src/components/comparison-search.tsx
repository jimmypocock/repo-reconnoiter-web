"use client";

import { useState, FormEvent } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ComparisonSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

/**
 * Search bar for filtering existing comparisons
 * Always visible to all users (authenticated or not)
 */
export function ComparisonSearch({ onSearch, initialValue = "" }: ComparisonSearchProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="search"
              id="comparison-search"
              name="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search comparisons..."
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pr-4 pl-10 text-sm text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500"
              autoComplete="off"
            />
          </div>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
