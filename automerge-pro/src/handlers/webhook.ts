import { Request, Response } from 'express';
import { Webhooks } from '@octokit/webhooks';
import { GitHubWebhookEvent } from '../types/index';
import { PullRequestService } from '../services/pullRequestService';
import { CheckRunService } from '../services/checkRunService';
import { LicenseService } from '../services/licenseService';
import { ConfigService } from '../services/configService';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

// Pull request event handler
webhooks.on('pull_request', async ({ payload }) => {
  const event = payload as unknown as GitHubWebhookEvent;
  console.log(`Received pull_request event: ${event.action}`);
  
  try {
    switch (event.action) {
      case 'opened':
      case 'synchronize':
      case 'labeled':
      case 'unlabeled':
      case 'review_requested':
      case 'ready_for_review':
        await PullRequestService.handlePullRequestUpdate(event);
        break;
      default:
        console.log(`Unhandled pull_request action: ${event.action}`);
    }
  } catch (error) {
    console.error('Error handling pull_request event:', error);
  }
});

// Check run event handler
webhooks.on('check_run', async ({ payload }) => {
  const event = payload as unknown as GitHubWebhookEvent;
  console.log(`Received check_run event: ${event.action}`);
  
  try {
    if (event.action === 'completed') {
      await CheckRunService.handleCheckRunCompleted(event);
    }
  } catch (error) {
    console.error('Error handling check_run event:', error);
  }
});

// Marketplace purchase event handler
webhooks.on('marketplace_purchase', async ({ payload }) => {
  const event = payload as unknown as GitHubWebhookEvent;
  console.log(`Received marketplace_purchase event: ${event.action}`);
  
  try {
    await LicenseService.handleMarketplacePurchase(event);
  } catch (error) {
    console.error('Error handling marketplace_purchase event:', error);
  }
});

// Installation event handler
webhooks.on('installation', async ({ payload }) => {
  const event = payload as unknown as GitHubWebhookEvent;
  console.log(`Received installation event: ${event.action}`);
  
  try {
    switch (event.action) {
      case 'created':
        await LicenseService.handleInstallationCreated(event);
        break;
      case 'deleted':
        await LicenseService.handleInstallationDeleted(event);
        break;
    }
  } catch (error) {
    console.error('Error handling installation event:', error);
  }
});

export const webhookHandler = async (req: Request, res: Response) => {
  try {
    await webhooks.verifyAndReceive({
      id: req.headers['x-github-delivery'] as string,
      name: req.headers['x-github-event'] as any,
      signature: req.headers['x-hub-signature-256'] as string,
      payload: JSON.stringify(req.body),
    });
    
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook verification failed:', error);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
};