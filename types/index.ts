export type PricingType =
  | "free"
  | "freemium"
  | "paid"
  | "open_source"
  | "enterprise";

export type AgentStatus = "draft" | "published" | "archived" | "pending";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description?: string | null;
  website_url?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  docs_url?: string | null;
  mcp_url?: string | null;
  pricing_type: PricingType;
  pricing_details?: string | null;
  is_open_source: boolean;
  is_self_hostable: boolean;
  has_api: boolean;
  has_mcp: boolean;
  is_structured: boolean;
  payment_ready: boolean;
  rating: number;
  review_count: number;
  view_count: number;
  agent_ready_score: number;
  status: AgentStatus;
  source?: string | null;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  categories?: Category[];
  tags?: Tag[];
}

export interface Submission {
  id: string;
  name: string;
  website_url?: string | null;
  short_description?: string | null;
  submitted_by?: string | null;
  status: SubmissionStatus;
  notes?: string | null;
  created_at: string;
}

export interface SearchFilters {
  q?: string;
  pricing?: PricingType | "all";
  open_source?: boolean;
  has_mcp?: boolean;
  has_api?: boolean;
  self_hostable?: boolean;
  category?: string;
  sort?: "relevance" | "score" | "rating" | "newest";
}

export interface SearchResult {
  agents: Agent[];
  total: number;
  query: string;
}
