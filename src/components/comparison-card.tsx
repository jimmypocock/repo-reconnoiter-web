import type { Comparison } from "@/types/api";
import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  comparison: Comparison;
}

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  const formattedDate = new Date(comparison.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-200 dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">
          {comparison.user_query}
        </h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500 dark:text-zinc-400">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{comparison.repos_compared_count} repos compared</span>
          <span>•</span>
          <span>{comparison.view_count} views</span>
        </div>
      </div>

      {/* Technologies & Domains */}
      {(comparison.technologies || comparison.problem_domains) && (
        <div className="mb-4 space-y-2">
          {comparison.technologies && (
            <div className="flex flex-wrap gap-2">
              {comparison.technologies.split(",").map((tech, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          )}
          {comparison.problem_domains && (
            <div className="flex flex-wrap gap-2">
              {comparison.problem_domains.split(",").map((domain, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                >
                  {domain.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Repo */}
      {comparison.recommended_repo && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 border border-blue-100 dark:bg-zinc-800/50">
          <div className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-zinc-400">
            Recommended
          </div>
          <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-zinc-100">
            {comparison.recommended_repo}
          </div>
        </div>
      )}

      {/* Repositories */}
      {comparison.repositories.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-600 dark:text-zinc-400">
            Repositories Analyzed
          </div>
          <div className="flex flex-wrap gap-2">
            {comparison.repositories.slice(0, 5).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:border-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <span className="font-mono">{repo.full_name}</span>
                {repo.stargazers_count > 0 && (
                  <span className="text-slate-500 dark:text-zinc-400">
                    ⭐ {repo.stargazers_count.toLocaleString()}
                  </span>
                )}
              </a>
            ))}
            {comparison.repositories.length > 5 && (
              <span className="inline-flex items-center rounded-md px-3 py-1.5 text-xs text-slate-500 dark:text-zinc-400">
                +{comparison.repositories.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
