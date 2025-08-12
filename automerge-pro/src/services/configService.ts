import { Octokit } from '@octokit/rest';
import yaml from 'js-yaml';
import Joi from 'joi';
import { AutomergeConfig } from '../types/index';

// Configuration validation schema
const configSchema = Joi.object({
  enabled: Joi.boolean().default(true),
  strategy: Joi.string().valid('merge', 'squash', 'rebase').default('merge'),
  conditions: Joi.object({
    required_status_checks: Joi.array().items(Joi.string()).default([]),
    required_reviews: Joi.number().min(0).default(1),
    dismiss_stale_reviews: Joi.boolean().default(false),
    require_code_owner_reviews: Joi.boolean().default(false),
    required_labels: Joi.array().items(Joi.string()).optional(),
    blocked_labels: Joi.array().items(Joi.string()).optional(),
    merge_method: Joi.string().valid('merge', 'squash', 'rebase').optional()
  }).required(),
  schedule: Joi.object({
    timezone: Joi.string().default('UTC'),
    hours: Joi.array().items(Joi.number().min(0).max(23)).default([9, 10, 11, 12, 13, 14, 15, 16, 17])
  }).optional()
});

// In-memory cache for configs (in production, use Redis)
const configCache = new Map<string, { config: AutomergeConfig; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class ConfigService {
  private static async getGitHubClient(installationId: number): Promise<Octokit> {
    // In a real implementation, you'd generate a JWT and exchange it for an installation token
    const token = process.env.GITHUB_TOKEN;
    return new Octokit({ auth: token });
  }

  static async getConfig(
    owner: string, 
    repo: string, 
    installationId: number
  ): Promise<AutomergeConfig | null> {
    const cacheKey = `${owner}/${repo}`;
    const cached = configCache.get(cacheKey);
    
    // Return cached config if still valid
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return cached.config;
    }

    try {
      const octokit = await this.getGitHubClient(installationId);
      
      // Try to fetch .automerge-pro.yml from repository
      const { data: file } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: '.automerge-pro.yml',
      });

      if ('content' in file) {
        const content = Buffer.from(file.content, 'base64').toString('utf8');
        const rawConfig = yaml.load(content) as any;
        
        // Validate and normalize configuration
        const { error, value: config } = configSchema.validate(rawConfig, {
          allowUnknown: false,
          stripUnknown: true
        });

        if (error) {
          console.error(`Invalid configuration in ${owner}/${repo}:`, error.details);
          return null;
        }

        // Cache the validated config
        configCache.set(cacheKey, {
          config,
          timestamp: Date.now()
        });

        return config;
      }
    } catch (error: any) {
      // If file doesn't exist (404), that's okay - return default config
      if (error.status === 404) {
        console.log(`No .automerge-pro.yml found in ${owner}/${repo}, using default config`);
        const defaultConfig = await this.getDefaultConfig();
        
        // Cache the default config briefly
        configCache.set(cacheKey, {
          config: defaultConfig,
          timestamp: Date.now()
        });

        return defaultConfig;
      } else {
        console.error(`Error fetching configuration from ${owner}/${repo}:`, error);
        return null;
      }
    }

    return null;
  }

  static async validateConfig(configYaml: string): Promise<{ valid: boolean; config?: AutomergeConfig; errors?: string[] }> {
    try {
      const rawConfig = yaml.load(configYaml) as any;
      const { error, value: config } = configSchema.validate(rawConfig, {
        allowUnknown: false,
        stripUnknown: true,
        abortEarly: false
      });

      if (error) {
        return {
          valid: false,
          errors: error.details.map(detail => detail.message)
        };
      }

      return {
        valid: true,
        config
      };
    } catch (yamlError) {
      return {
        valid: false,
        errors: ['Invalid YAML syntax']
      };
    }
  }

  static async getDefaultConfig(): Promise<AutomergeConfig> {
    return {
      enabled: true,
      strategy: 'merge',
      conditions: {
        required_status_checks: [],
        required_reviews: 1,
        dismiss_stale_reviews: false,
        require_code_owner_reviews: false
      }
    };
  }

  static getConfigTemplate(): string {
    return `# Automerge-Pro Configuration
# This file configures automated pull request merging behavior

# Enable or disable automerge for this repository
enabled: true

# Merge strategy: 'merge', 'squash', or 'rebase'
strategy: merge

# Conditions that must be met before auto-merging
conditions:
  # Required status checks that must pass
  required_status_checks:
    - "ci/tests"
    - "ci/lint"
  
  # Number of required approving reviews
  required_reviews: 1
  
  # Whether to dismiss stale reviews when new commits are pushed
  dismiss_stale_reviews: false
  
  # Whether to require reviews from code owners
  require_code_owner_reviews: false
  
  # Labels that must be present for auto-merge
  required_labels:
    - "automerge"
  
  # Labels that block auto-merge
  blocked_labels:
    - "wip"
    - "do-not-merge"

# Optional: Schedule when auto-merges can happen
# schedule:
#   timezone: "America/New_York"
#   hours: [9, 10, 11, 12, 13, 14, 15, 16, 17]  # 9 AM to 5 PM
`;
  }

  static clearCache(owner: string, repo: string): void {
    const cacheKey = `${owner}/${repo}`;
    configCache.delete(cacheKey);
  }
}