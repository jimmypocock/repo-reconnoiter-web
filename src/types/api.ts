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

export interface ComparisonsParams {
  search?: string;
  date?: "week" | "month";
  sort?: "recent" | "popular";
  page?: number;
  per_page?: number;
}
