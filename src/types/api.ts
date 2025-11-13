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
