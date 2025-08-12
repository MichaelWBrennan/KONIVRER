export interface AutomergePro {
  version: string;
  rules: MergeRule[];
  conditions: MergeConditions;
  notifications: NotificationSettings;
  billing?: BillingTier;
}

export interface MergeRule {
  name: string;
  enabled: boolean;
  conditions: string[];
  actions: MergeAction[];
  priority: number;
}

export interface MergeConditions {
  required_status_checks: string[];
  required_reviews: number;
  dismiss_stale_reviews: boolean;
  require_code_owner_reviews: boolean;
  required_approving_review_count: number;
  allow_squash_merge: boolean;
  allow_merge_commit: boolean;
  allow_rebase_merge: boolean;
}

export interface MergeAction {
  type: 'merge' | 'squash' | 'rebase' | 'comment' | 'label' | 'assign';
  value?: string;
  delay?: number;
}

export interface NotificationSettings {
  channels: NotificationChannel[];
  events: string[];
  template?: string;
}

export interface NotificationChannel {
  type: 'slack' | 'email' | 'github' | 'webhook';
  endpoint: string;
  events: string[];
}

export type BillingTier = 'free' | 'pro' | 'enterprise';

export interface GitHubWebhookEvent {
  action: string;
  number?: number;
  pull_request?: any;
  check_run?: any;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
    };
  };
  installation: {
    id: number;
  };
}

export interface LicenseData {
  installationId: number;
  tier: BillingTier;
  features: string[];
  expiresAt?: Date;
  trialEndsAt?: Date;
  isActive: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  config?: AutomergePro;
}