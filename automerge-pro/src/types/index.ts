export interface GitHubWebhookEvent {
  action: string;
  number?: number;
  pull_request?: PullRequest;
  check_run?: CheckRun;
  marketplace_purchase?: MarketplacePurchase;
  repository?: Repository;
  sender: User;
  installation?: Installation;
}

export interface PullRequest {
  id: number;
  number: number;
  state: 'open' | 'closed';
  title: string;
  body?: string;
  head: {
    ref: string;
    sha: string;
    repo: Repository;
  };
  base: {
    ref: string;
    sha: string;
    repo: Repository;
  };
  mergeable?: boolean;
  mergeable_state?: string;
  user: User;
  assignees: User[];
  requested_reviewers: User[];
  labels: Label[];
  draft: boolean;
  merged: boolean;
  merge_commit_sha?: string;
}

export interface CheckRun {
  id: number;
  name: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required';
  head_sha: string;
  pull_requests: PullRequest[];
}

export interface MarketplacePurchase {
  account: User;
  plan: {
    id: number;
    name: string;
    description: string;
    monthly_price_in_cents: number;
    yearly_price_in_cents: number;
    price_model: 'flat_rate' | 'per_unit';
    has_free_trial: boolean;
    unit_name?: string;
    bullets: string[];
  };
  action: 'purchased' | 'cancelled' | 'changed';
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: User;
  private: boolean;
  default_branch: string;
}

export interface User {
  id: number;
  login: string;
  type: 'User' | 'Bot' | 'Organization';
}

export interface Label {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface Installation {
  id: number;
  account: User;
  target_type: 'User' | 'Organization';
  permissions: Record<string, string>;
}

export interface AutomergeConfig {
  enabled: boolean;
  strategy: 'merge' | 'squash' | 'rebase';
  conditions: {
    required_status_checks: string[];
    required_reviews: number;
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    required_labels?: string[];
    blocked_labels?: string[];
    merge_method?: 'merge' | 'squash' | 'rebase';
  };
  schedule?: {
    timezone: string;
    hours: number[];
  };
}

export interface FeatureTier {
  name: 'free' | 'pro' | 'enterprise';
  max_repositories: number;
  advanced_conditions: boolean;
  scheduling: boolean;
  priority_support: boolean;
  custom_rules: boolean;
}

export interface LicenseInfo {
  installation_id: number;
  tier: FeatureTier['name'];
  expires_at?: Date;
  is_active: boolean;
  repositories_count: number;
}