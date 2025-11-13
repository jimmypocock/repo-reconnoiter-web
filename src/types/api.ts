/**
 * API Response Types
 * Based on OpenAPI specification
 */

export interface Category {
  id: number;
  name: string;
  category_type: string;
}

export interface Repository {
  id: number;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  html_url: string;
}

export interface Comparison {
  id: number;
  user_query: string;
  normalized_query: string;
  technologies: string | null;
  problem_domains: string | null;
  architecture_patterns: string | null;
  repos_compared_count: number;
  recommended_repo: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  categories: Category[];
  repositories: Repository[];
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface ComparisonsResponse {
  data: Comparison[];
  meta: {
    pagination: PaginationMeta;
  };
}

export interface ComparisonResponse {
  data: Comparison;
}

export interface ComparisonsParams {
  search?: string;
  date?: "week" | "month";
  sort?: "recent" | "popular";
  page?: number;
  per_page?: number;
}

/**
 * Comparison Creation Types
 */

export interface CreateComparisonRequest {
  query: string;
}

export interface CreateComparisonResponse {
  session_id: string;
  status: "processing";
  websocket_url: string;
  status_url: string;
}

export type ComparisonStep =
  | "parsing_query"
  | "searching_github"
  | "analyzing_repositories"
  | "comparing_repositories";

export interface ComparisonStatusResponse {
  status: "processing" | "complete" | "error";
  step?: ComparisonStep;
  message?: string;
  percentage?: number;
  current?: number;
  total?: number;
  comparison_id?: number;
  redirect_url?: string;
  error?: string;
}

/**
 * WebSocket Message Types
 */

export interface ProgressMessage {
  type: "progress";
  step: ComparisonStep;
  message: string;
  percentage: number;
  current?: number;
  total?: number;
  timestamp: string;
}

export interface CompleteMessage {
  type: "complete";
  comparison_id: number;
  redirect_url: string;
  message: string;
  timestamp: string;
}

export interface ErrorMessage {
  type: "error";
  message: string;
  retry_data?: Record<string, unknown>;
  timestamp: string;
}

export type ComparisonWebSocketMessage = ProgressMessage | CompleteMessage | ErrorMessage;

/**
 * Profile Types
 */

export interface UserProfile {
  id: number;
  email: string;
  github_username: string;
  github_id: number;
  github_avatar_url: string;
  admin: boolean;
}

export interface UsageStats {
  comparisons_this_month: number;
  analyses_this_month: number;
  remaining_comparisons_today: number;
  remaining_analyses_today: number;
  total_cost_spent: string | number;
}

export interface RecentComparison {
  id: number;
  user_query: string;
  repos_compared_count: number;
  created_at: string;
}

export interface RecentAnalysis {
  id: number;
  repository_name: string;
  model_used: string;
  created_at: string;
}

export interface ProfileResponse {
  data: {
    user: UserProfile;
    stats: UsageStats;
    recent_comparisons: RecentComparison[];
    recent_analyses: RecentAnalysis[];
  };
}

/**
 * Admin Stats Types
 */

export interface AISpending {
  today: string | number;
  this_week: string | number;
  this_month: string | number;
  total: string | number;
  projected_month: string | number;
}

export interface Budget {
  monthly_limit: string | number;
  remaining: string | number;
  percentage_used: string | number;
  status: "healthy" | "warning" | "critical" | "exceeded";
}

export interface PlatformMetrics {
  comparisons_count: number;
  repositories_count: number;
  total_views: number;
}

export interface SpendByModel {
  model: string;
  cost: string | number;
  percentage: string | number;
}

export interface SpendByUser {
  username: string;
  cost: string | number;
  percentage: string | number;
}

export interface AdminStatsResponse {
  data: {
    ai_spending: AISpending;
    budget: Budget;
    platform: PlatformMetrics;
    spend_by_model: SpendByModel[];
    spend_by_user: SpendByUser[];
  };
}
