import { GitHubWebhookEvent } from '../types';
import { GitHubService } from '../services/github';
import { LicenseService } from '../services/license';
import { ConfigService } from '../services/config';

export class WebhookHandler {
  constructor(
    private githubService: GitHubService,
    private licenseService: LicenseService,
    private configService: ConfigService
  ) {}

  async handlePullRequest(event: GitHubWebhookEvent): Promise<void> {
    const { action, pull_request, repository, installation } = event;
    
    if (!pull_request || !installation) {
      console.warn('Missing pull_request or installation data in webhook');
      return;
    }

    console.log(`Processing pull request ${action} for ${repository.full_name}#${pull_request.number}`);

    // Only process certain actions
    const relevantActions = ['opened', 'synchronize', 'reopened', 'edited', 'review_requested'];
    if (!relevantActions.includes(action)) {
      return;
    }

    try {
      // Get and validate configuration
      const validation = await this.configService.getAndValidateConfig(
        installation.id,
        repository.owner.login,
        repository.name
      );

      if (!validation.valid) {
        console.error('Invalid configuration:', validation.errors);
        
        // Comment on PR about configuration issues
        await this.githubService.addComment(
          installation.id,
          repository.owner.login,
          repository.name,
          pull_request.number,
          `❌ **Automerge-Pro Configuration Error**\n\n${validation.errors.join('\n')}\n\nPlease fix your \`.automerge-pro.yml\` file and try again.`
        );
        return;
      }

      if (validation.warnings.length > 0) {
        await this.githubService.addComment(
          installation.id,
          repository.owner.login,
          repository.name,
          pull_request.number,
          `⚠️ **Automerge-Pro Configuration Warnings**\n\n${validation.warnings.join('\n')}\n\nYour configuration will work but some features may be limited by your current plan.`
        );
      }

      // Check if PR is ready for auto-merge
      await this.evaluateAutoMerge(
        installation.id,
        repository.owner.login,
        repository.name,
        pull_request.number,
        validation.config!
      );

    } catch (error) {
      console.error('Error handling pull request webhook:', error);
      await this.githubService.addComment(
        installation.id,
        repository.owner.login,
        repository.name,
        pull_request.number,
        `❌ **Automerge-Pro Error**\n\nAn unexpected error occurred while processing this pull request. Please contact support if this persists.\n\n\`\`\`\n${(error as any).message}\n\`\`\``
      );
    }
  }

  async handleCheckRun(event: GitHubWebhookEvent): Promise<void> {
    const { action, check_run, repository, installation } = event;
    
    if (!check_run || !installation) {
      return;
    }

    console.log(`Processing check run ${action} for ${repository.full_name}`);

    // Only process completed check runs
    if (action !== 'completed') {
      return;
    }

    try {
      // Find related pull requests
      const pullRequests = check_run.pull_requests || [];
      
      for (const pr of pullRequests) {
        // Get configuration and evaluate auto-merge for each PR
        const validation = await this.configService.getAndValidateConfig(
          installation.id,
          repository.owner.login,
          repository.name
        );

        if (validation.valid && validation.config) {
          await this.evaluateAutoMerge(
            installation.id,
            repository.owner.login,
            repository.name,
            pr.number,
            validation.config
          );
        }
      }
    } catch (error) {
      console.error('Error handling check run webhook:', error);
    }
  }

  async handleMarketplacePurchase(event: any): Promise<void> {
    console.log('Processing marketplace purchase event:', event.action);

    try {
      switch (event.action) {
        case 'purchased':
        case 'changed':
          await this.licenseService.processMarketplacePurchase(event);
          console.log(`License updated for installation ${event.account.id}`);
          break;
        
        case 'cancelled':
          await this.licenseService.updateLicense(event.account.id, {
            tier: 'free',
            features: ['basic_merge', 'status_checks'],
            isActive: true
          });
          console.log(`License downgraded to free for installation ${event.account.id}`);
          break;

        default:
          console.log(`Unhandled marketplace action: ${event.action}`);
      }
    } catch (error) {
      console.error('Error handling marketplace purchase:', error);
    }
  }

  private async evaluateAutoMerge(
    installationId: number,
    owner: string,
    repo: string,
    pullNumber: number,
    config: any
  ): Promise<void> {
    try {
      // Get current PR status
      const prStatus = await this.githubService.getPullRequestStatus(
        installationId,
        owner,
        repo,
        pullNumber
      );

      console.log(`PR ${pullNumber} status:`, prStatus);

      // Check each rule in priority order
      const sortedRules = config.rules.sort((a: any, b: any) => b.priority - a.priority);
      
      for (const rule of sortedRules) {
        if (!rule.enabled) {
          continue;
        }

        // Check if all conditions are met
        const conditionsMet = await this.checkRuleConditions(
          rule,
          prStatus,
          config.conditions
        );

        if (conditionsMet) {
          console.log(`Rule "${rule.name}" conditions met for PR ${pullNumber}`);
          
          // Execute rule actions
          await this.executeRuleActions(
            installationId,
            owner,
            repo,
            pullNumber,
            rule
          );
          
          // Only execute first matching rule
          break;
        }
      }
    } catch (error) {
      console.error('Error evaluating auto-merge:', error);
    }
  }

  private async checkRuleConditions(
    rule: any,
    prStatus: any,
    globalConditions: any
  ): Promise<boolean> {
    for (const condition of rule.conditions) {
      switch (condition) {
        case 'status_checks_passed':
          if (!prStatus.statusChecks) return false;
          break;
        
        case 'required_reviews_approved':
          if (!prStatus.reviewsApproved || prStatus.reviewCount < globalConditions.required_reviews) {
            return false;
          }
          break;
        
        case 'mergeable':
          if (!prStatus.mergeable) return false;
          break;
        
        default:
          // Handle label conditions, branch conditions, etc.
          console.log(`Condition "${condition}" not implemented yet`);
      }
    }

    return true;
  }

  private async executeRuleActions(
    installationId: number,
    owner: string,
    repo: string,
    pullNumber: number,
    rule: any
  ): Promise<void> {
    console.log(`Executing actions for rule "${rule.name}" on PR ${pullNumber}`);

    for (const action of rule.actions) {
      try {
        switch (action.type) {
          case 'merge':
            await this.githubService.mergePullRequest(
              installationId,
              owner,
              repo,
              pullNumber,
              'merge',
              `Auto-merge by rule: ${rule.name}`,
              `Automatically merged by Automerge-Pro rule "${rule.name}"`
            );
            break;

          case 'squash':
            await this.githubService.mergePullRequest(
              installationId,
              owner,
              repo,
              pullNumber,
              'squash',
              `Auto-squash by rule: ${rule.name}`,
              `Automatically squashed by Automerge-Pro rule "${rule.name}"`
            );
            break;

          case 'rebase':
            await this.githubService.mergePullRequest(
              installationId,
              owner,
              repo,
              pullNumber,
              'rebase',
              `Auto-rebase by rule: ${rule.name}`,
              `Automatically rebased by Automerge-Pro rule "${rule.name}"`
            );
            break;

          case 'comment':
            if (action.value) {
              await this.githubService.addComment(
                installationId,
                owner,
                repo,
                pullNumber,
                action.value
              );
            }
            break;

          case 'label':
            if (action.value) {
              await this.githubService.addLabel(
                installationId,
                owner,
                repo,
                pullNumber,
                [action.value]
              );
            }
            break;

          default:
            console.log(`Action type "${action.type}" not implemented yet`);
        }

        // Add delay if specified
        if (action.delay) {
          await new Promise(resolve => setTimeout(resolve, action.delay * 1000));
        }

      } catch (error) {
        console.error(`Error executing action ${action.type}:`, error);
      }
    }
  }
}