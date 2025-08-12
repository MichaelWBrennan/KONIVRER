import { App } from '@octokit/app';
import { Octokit } from '@octokit/rest';
import * as jwt from 'jsonwebtoken';

export class GitHubService {
  private app: App;
  private installations: Map<number, any> = new Map();

  constructor(
    private appId: string,
    private privateKey: string,
    private webhookSecret: string
  ) {
    this.app = new App({
      appId: this.appId,
      privateKey: this.privateKey,
      webhooks: {
        secret: this.webhookSecret
      }
    });
  }

  async getInstallationOctokit(installationId: number): Promise<any> {
    if (!this.installations.has(installationId)) {
      const octokit = await this.app.getInstallationOctokit(installationId);
      this.installations.set(installationId, octokit);
    }
    return this.installations.get(installationId)!;
  }

  async getRepositoryConfig(
    installationId: number, 
    owner: string, 
    repo: string
  ): Promise<string | null> {
    try {
      const octokit = await this.getInstallationOctokit(installationId);
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: '.automerge-pro.yml'
      });

      if ('content' in data) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      return null;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async mergePullRequest(
    installationId: number,
    owner: string,
    repo: string,
    pullNumber: number,
    mergeMethod: 'merge' | 'squash' | 'rebase' = 'squash',
    commitTitle?: string,
    commitMessage?: string
  ): Promise<boolean> {
    try {
      const octokit = await this.getInstallationOctokit(installationId);
      
      await octokit.pulls.merge({
        owner,
        repo,
        pull_number: pullNumber,
        merge_method: mergeMethod,
        commit_title: commitTitle,
        commit_message: commitMessage
      });
      
      return true;
    } catch (error) {
      console.error('Failed to merge pull request:', error);
      return false;
    }
  }

  async addComment(
    installationId: number,
    owner: string,
    repo: string,
    issueNumber: number,
    body: string
  ): Promise<void> {
    const octokit = await this.getInstallationOctokit(installationId);
    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body
    });
  }

  async addLabel(
    installationId: number,
    owner: string,
    repo: string,
    issueNumber: number,
    labels: string[]
  ): Promise<void> {
    const octokit = await this.getInstallationOctokit(installationId);
    await octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels
    });
  }

  async getPullRequestStatus(
    installationId: number,
    owner: string,
    repo: string,
    pullNumber: number
  ): Promise<{
    mergeable: boolean;
    statusChecks: boolean;
    reviewsApproved: boolean;
    reviewCount: number;
  }> {
    const octokit = await this.getInstallationOctokit(installationId);
    
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: pullNumber
    });

    // Get status checks
    const { data: status } = await octokit.repos.getCombinedStatusForRef({
      owner,
      repo,
      ref: pr.head.sha
    });

    // Get reviews
    const { data: reviews } = await octokit.pulls.listReviews({
      owner,
      repo,
      pull_number: pullNumber
    });

    const approvedReviews = reviews.filter((review: any) => review.state === 'APPROVED');
    const changesRequestedReviews = reviews.filter((review: any) => review.state === 'CHANGES_REQUESTED');

    return {
      mergeable: pr.mergeable === true,
      statusChecks: status.state === 'success',
      reviewsApproved: changesRequestedReviews.length === 0 && approvedReviews.length > 0,
      reviewCount: approvedReviews.length
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const expectedSignature = 'sha256=' + 
      require('crypto')
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');
    
    return signature === expectedSignature;
  }
}