import * as yaml from 'yaml';
import { AutomergePro, ValidationResult } from '../types';
import { validateConfig, validateFeatureAccess } from '../schemas/config';
import { GitHubService } from './github';
import { LicenseService } from './license';

export class ConfigService {
  constructor(
    private githubService: GitHubService,
    private licenseService: LicenseService
  ) {}

  async getAndValidateConfig(
    installationId: number,
    owner: string,
    repo: string
  ): Promise<ValidationResult> {
    try {
      // Get configuration file from repository
      const configContent = await this.githubService.getRepositoryConfig(installationId, owner, repo);
      
      if (!configContent) {
        return {
          valid: false,
          errors: ['No .automerge-pro.yml configuration file found in repository root'],
          warnings: []
        };
      }

      // Parse YAML
      let parsedConfig: any;
      try {
        parsedConfig = yaml.parse(configContent);
      } catch (yamlError: any) {
        return {
          valid: false,
          errors: [`Invalid YAML syntax: ${yamlError.message}`],
          warnings: []
        };
      }

      // Validate schema
      const { error, value } = validateConfig(parsedConfig);
      if (error) {
        return {
          valid: false,
          errors: (error as any).details.map((detail: any) => detail.message),
          warnings: []
        };
      }

      // Validate license and feature access
      const license = await this.licenseService.validateLicense(installationId);
      if (!license || !license.isActive) {
        return {
          valid: false,
          errors: ['Invalid or expired license. Please check your GitHub Marketplace subscription.'],
          warnings: []
        };
      }

      // Check feature access based on billing tier
      const warnings: string[] = [];
      const config = value as AutomergePro;
      
      // Check advanced rules (Pro+ feature)
      if (config.rules.some(rule => rule.conditions.length > 2) && !validateFeatureAccess(license.tier, 'advanced_rules')) {
        warnings.push('Advanced rules with more than 2 conditions require Pro or Enterprise tier');
      }

      // Check notifications (Pro+ feature)
      if (config.notifications.channels.length > 0 && !validateFeatureAccess(license.tier, 'notifications')) {
        warnings.push('Custom notifications require Pro or Enterprise tier');
      }

      // Check custom actions (Enterprise feature)
      const hasCustomActions = config.rules.some(rule => 
        rule.actions.some(action => ['comment', 'label', 'assign'].includes(action.type))
      );
      if (hasCustomActions && !validateFeatureAccess(license.tier, 'custom_actions')) {
        warnings.push('Custom actions (comments, labels, assignments) require Enterprise tier');
      }

      return {
        valid: true,
        errors: [],
        warnings,
        config
      };

    } catch (error: any) {
      return {
        valid: false,
        errors: [`Failed to process configuration: ${error.message}`],
        warnings: []
      };
    }
  }

  async canExecuteRule(
    installationId: number,
    ruleName: string,
    requiredFeatures: string[]
  ): Promise<boolean> {
    const license = await this.licenseService.validateLicense(installationId);
    if (!license || !license.isActive) {
      return false;
    }

    return requiredFeatures.every(feature => 
      validateFeatureAccess(license.tier, feature)
    );
  }

  generateSampleConfig(tier: 'free' | 'pro' | 'enterprise' = 'free'): string {
    const configs = {
      free: {
        version: '2.0',
        rules: [
          {
            name: 'auto-merge-approved',
            enabled: true,
            conditions: [
              'status_checks_passed',
              'required_reviews_approved'
            ],
            actions: [
              { type: 'squash' }
            ],
            priority: 50
          }
        ],
        conditions: {
          required_status_checks: ['ci/build', 'ci/test'],
          required_reviews: 1,
          dismiss_stale_reviews: false,
          require_code_owner_reviews: false,
          required_approving_review_count: 1,
          allow_squash_merge: true,
          allow_merge_commit: false,
          allow_rebase_merge: false
        },
        notifications: {
          channels: [],
          events: []
        }
      },
      pro: {
        version: '2.0',
        rules: [
          {
            name: 'auto-merge-hotfix',
            enabled: true,
            conditions: [
              'label:hotfix',
              'status_checks_passed',
              'required_reviews_approved',
              'branch_protection_satisfied'
            ],
            actions: [
              { type: 'comment', value: 'Auto-merging hotfix after validation ✅' },
              { type: 'merge' }
            ],
            priority: 90
          },
          {
            name: 'auto-merge-feature',
            enabled: true,
            conditions: [
              'status_checks_passed',
              'required_reviews_approved',
              '!draft'
            ],
            actions: [
              { type: 'squash' }
            ],
            priority: 50
          }
        ],
        conditions: {
          required_status_checks: ['ci/build', 'ci/test', 'ci/security'],
          required_reviews: 2,
          dismiss_stale_reviews: true,
          require_code_owner_reviews: true,
          required_approving_review_count: 2,
          allow_squash_merge: true,
          allow_merge_commit: true,
          allow_rebase_merge: false
        },
        notifications: {
          channels: [
            {
              type: 'slack',
              endpoint: 'https://hooks.slack.com/your-webhook-url',
              events: ['merge_success', 'merge_failure', 'rule_triggered']
            }
          ],
          events: ['pull_request_merged', 'status_check_failed'],
          template: 'PR #{number} "{title}" was auto-merged by {rule_name}'
        }
      },
      enterprise: {
        version: '2.0',
        rules: [
          {
            name: 'security-approved-merge',
            enabled: true,
            conditions: [
              'label:security-approved',
              'status_checks_passed',
              'required_reviews_approved',
              'no_merge_conflicts',
              'branch_protection_satisfied'
            ],
            actions: [
              { type: 'comment', value: 'Security review complete. Auto-merging... 🔒' },
              { type: 'label', value: 'merged-by-automerge-pro' },
              { type: 'merge' }
            ],
            priority: 95
          },
          {
            name: 'feature-branch-auto-merge',
            enabled: true,
            conditions: [
              'base_branch:main',
              'status_checks_passed',
              'required_reviews_approved',
              'files_changed_count:<50'
            ],
            actions: [
              { type: 'assign', value: 'release-manager' },
              { type: 'squash' }
            ],
            priority: 70
          }
        ],
        conditions: {
          required_status_checks: ['ci/build', 'ci/test', 'ci/security', 'ci/compliance'],
          required_reviews: 3,
          dismiss_stale_reviews: true,
          require_code_owner_reviews: true,
          required_approving_review_count: 3,
          allow_squash_merge: true,
          allow_merge_commit: true,
          allow_rebase_merge: true
        },
        notifications: {
          channels: [
            {
              type: 'slack',
              endpoint: 'https://hooks.slack.com/services/your-webhook',
              events: ['merge_success', 'merge_failure', 'rule_triggered', 'security_check']
            },
            {
              type: 'webhook',
              endpoint: 'https://your-api.com/automerge-notifications',
              events: ['all']
            }
          ],
          events: ['pull_request_merged', 'pull_request_closed', 'status_check_failed', 'review_submitted'],
          template: '🚀 PR #{number} "{title}" merged via rule "{rule_name}" by {author}. Changes: {files_changed} files, +{additions}/-{deletions}'
        }
      }
    };

    return yaml.stringify(configs[tier], { indent: 2 });
  }
}