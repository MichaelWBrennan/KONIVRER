import { GitHubWebhookEvent } from '../types/index';
import { PullRequestService } from './pullRequestService';

export class CheckRunService {
  static async handleCheckRunCompleted(event: GitHubWebhookEvent): Promise<void> {
    if (!event.check_run) {
      console.log('No check run data in event');
      return;
    }

    const { check_run: checkRun } = event;
    
    // Only proceed if the check run was successful
    if (checkRun.conclusion !== 'success') {
      console.log(`Check run ${checkRun.name} completed with conclusion: ${checkRun.conclusion}`);
      return;
    }

    console.log(`Check run ${checkRun.name} completed successfully`);

    // Check if this check run is associated with any pull requests
    if (checkRun.pull_requests && checkRun.pull_requests.length > 0) {
      for (const pr of checkRun.pull_requests) {
        console.log(`Processing PR #${pr.number} due to successful check run`);
        
        // Create a synthetic event for the pull request service
        const syntheticEvent: GitHubWebhookEvent = {
          action: 'synchronize',
          pull_request: pr,
          repository: event.repository,
          sender: event.sender,
          installation: event.installation
        };

        // Trigger pull request evaluation
        await PullRequestService.handlePullRequestUpdate(syntheticEvent);
      }
    }
  }
}