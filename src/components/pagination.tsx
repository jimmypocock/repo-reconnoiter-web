import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = generatePageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          currentPage === 1
            ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        )}
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-10 w-10 items-center justify-center text-slate-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={cn(
                "h-10 w-10 rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              )}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          currentPage === totalPages
            ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-600"
            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        )}
      >
        Next
      </button>
    </div>
  );
}

/**
 * Generate page numbers with ellipsis
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // Always show first page
  pages.push(1);

  // Show ellipsis or page 2
  if (showEllipsisStart) {
    pages.push("...");
  } else if (totalPages > 1) {
    pages.push(2);
  }

  // Show current page and neighbors
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (i !== 1 && i !== totalPages && !pages.includes(i)) {
      pages.push(i);
    }
  }

  // Show ellipsis or second-to-last page
  if (showEllipsisEnd) {
    pages.push("...");
  } else if (totalPages > 2 && !pages.includes(totalPages - 1)) {
    pages.push(totalPages - 1);
  }

  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}
