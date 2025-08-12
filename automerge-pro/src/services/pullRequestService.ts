import { Octokit } from '@octokit/rest';
import { GitHubWebhookEvent, AutomergeConfig } from '../types/index';
import { ConfigService } from './configService';
import { LicenseService } from './licenseService';

export class PullRequestService {
  private static async getGitHubClient(installationId: number): Promise<Octokit> {
    // In a real implementation, you'd generate a JWT and exchange it for an installation token
    const token = process.env.GITHUB_TOKEN;
    return new Octokit({ auth: token });
  }

  static async handlePullRequestUpdate(event: GitHubWebhookEvent): Promise<void> {
    if (!event.pull_request || !event.installation || !event.repository) {
      console.log('No pull request, installation, or repository data in event');
      return;
    }

    const { pull_request: pr, repository, installation } = event;
    
    // Check if automerge is enabled for this repository
    const config = await ConfigService.getConfig(repository.owner.login, repository.name, installation.id);
    if (!config || !config.enabled) {
      console.log('Automerge not enabled for this repository');
      return;
    }

    // Check license/feature gating
    const hasPermission = await LicenseService.hasFeatureAccess(installation.id, 'automerge');
    if (!hasPermission) {
      console.log('Installation does not have permission for automerge feature');
      return;
    }

    // Skip draft PRs unless specifically configured
    if (pr.draft) {
      console.log('Skipping draft pull request');
      return;
    }

    // Check if PR meets automerge conditions
    const canMerge = await this.checkMergeConditions(pr, config, installation.id);
    if (canMerge) {
      await this.mergePullRequest(pr, repository, config, installation.id);
    } else {
      console.log('Pull request does not meet merge conditions yet');
    }
  }

  private static async checkMergeConditions(
    pr: NonNullable<GitHubWebhookEvent['pull_request']>,
    config: AutomergeConfig,
    installationId: number
  ): Promise<boolean> {
    const octokit = await this.getGitHubClient(installationId);
    
    // Check required labels
    if (config.conditions.required_labels) {
      const prLabels = pr.labels.map(label => label.name);
      const hasRequiredLabels = config.conditions.required_labels.every(
        requiredLabel => prLabels.includes(requiredLabel)
      );
      if (!hasRequiredLabels) {
        console.log('Missing required labels');
        return false;
      }
    }

    // Check blocked labels
    if (config.conditions.blocked_labels) {
      const prLabels = pr.labels.map(label => label.name);
      const hasBlockedLabels = config.conditions.blocked_labels.some(
        blockedLabel => prLabels.includes(blockedLabel)
      );
      if (hasBlockedLabels) {
        console.log('Pull request has blocked labels');
        return false;
      }
    }

    // Check if mergeable
    if (pr.mergeable === false) {
      console.log('Pull request is not mergeable');
      return false;
    }

    // Check status checks
    if (config.conditions.required_status_checks.length > 0) {
      try {
        const { data: statusChecks } = await octokit.rest.repos.getCombinedStatusForRef({
          owner: pr.head.repo.owner.login,
          repo: pr.head.repo.name,
          ref: pr.head.sha,
        });

        if (statusChecks.state !== 'success') {
          console.log('Status checks not passing');
          return false;
        }
      } catch (error) {
        console.error('Error checking status:', error);
        return false;
      }
    }

    // Check reviews
    if (config.conditions.required_reviews > 0) {
      try {
        const { data: reviews } = await octokit.rest.pulls.listReviews({
          owner: pr.head.repo.owner.login,
          repo: pr.head.repo.name,
          pull_number: pr.number,
        });

        const approvedReviews = reviews.filter(review => review.state === 'APPROVED');
        if (approvedReviews.length < config.conditions.required_reviews) {
          console.log('Insufficient approved reviews');
          return false;
        }
      } catch (error) {
        console.error('Error checking reviews:', error);
        return false;
      }
    }

    return true;
  }

  private static async mergePullRequest(
    pr: NonNullable<GitHubWebhookEvent['pull_request']>,
    repository: NonNullable<GitHubWebhookEvent['repository']>,
    config: AutomergeConfig,
    installationId: number
  ): Promise<void> {
    const octokit = await this.getGitHubClient(installationId);
    
    try {
      const { data: mergeResult } = await octokit.rest.pulls.merge({
        owner: repository.owner.login,
        repo: repository.name,
        pull_number: pr.number,
        commit_title: `${config.strategy}: ${pr.title}`,
        commit_message: pr.body || '',
        merge_method: config.strategy,
      });

      console.log(`Successfully merged PR #${pr.number} using ${config.strategy} strategy`);
      console.log(`Merge commit SHA: ${mergeResult.sha}`);
    } catch (error) {
      console.error(`Failed to merge PR #${pr.number}:`, error);
    }
  }
}