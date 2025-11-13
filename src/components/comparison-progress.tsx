"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import type { ComparisonStep } from "@/types/api";

interface ComparisonProgressProps {
  step?: ComparisonStep;
  message?: string;
  percentage: number;
  current?: number;
  total?: number;
  onCancel?: () => void;
}

const STEP_LABELS: Record<ComparisonStep, string> = {
  parsing_query: "Understanding your query",
  searching_github: "Searching GitHub repositories",
  analyzing_repositories: "Analyzing repositories",
  comparing_repositories: "Comparing and ranking results",
};

/**
 * Progress indicator for async comparison creation
 * Shows real-time updates from WebSocket or polling
 */
export function ComparisonProgress({
  step,
  message,
  percentage,
  current,
  total,
  onCancel,
}: ComparisonProgressProps) {
  return (
    <div className="w-full max-w-2xl rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {step ? STEP_LABELS[step] : "Processing..."}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            aria-label="Cancel"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out dark:bg-blue-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Progress Details */}
      <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400">
        <div>
          {message && <p>{message}</p>}
          {current !== undefined && total !== undefined && (
            <p className="mt-1 text-xs">
              {current} of {total} completed
            </p>
          )}
        </div>
        <div className="font-medium tabular-nums">{Math.round(percentage)}%</div>
      </div>

      {/* Step Indicators */}
      {step && (
        <div className="mt-6 grid grid-cols-4 gap-2">
          {(Object.keys(STEP_LABELS) as ComparisonStep[]).map((s) => {
            const stepIndex = Object.keys(STEP_LABELS).indexOf(s);
            const currentIndex = Object.keys(STEP_LABELS).indexOf(step);
            const isComplete = stepIndex < currentIndex;
            const isCurrent = s === step;

            return (
              <div
                key={s}
                className={`h-1 rounded-full transition-colors ${
                  isComplete
                    ? "bg-blue-600 dark:bg-blue-500"
                    : isCurrent
                      ? "bg-blue-400 dark:bg-blue-400"
                      : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
