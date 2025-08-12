import { LicenseService } from '../../src/services/licenseService';
import { GitHubWebhookEvent } from '../../src/types';

describe('LicenseService', () => {
  const mockInstallationEvent: GitHubWebhookEvent = {
    action: 'created',
    installation: {
      id: 12345,
      account: { id: 1, login: 'testuser', type: 'User' },
      target_type: 'User',
      permissions: {}
    },
    repository: {
      id: 1,
      name: 'test-repo',
      full_name: 'testuser/test-repo',
      owner: { id: 1, login: 'testuser', type: 'User' },
      private: false,
      default_branch: 'main'
    },
    sender: { id: 1, login: 'testuser', type: 'User' }
  };

  describe('handleInstallationCreated', () => {
    it('should create a free tier license', async () => {
      await LicenseService.handleInstallationCreated(mockInstallationEvent);
      
      const license = await LicenseService.getLicenseInfo(12345);
      
      expect(license).toBeDefined();
      expect(license?.tier).toBe('free');
      expect(license?.is_active).toBe(true);
      expect(license?.installation_id).toBe(12345);
    });
  });

  describe('hasFeatureAccess', () => {
    beforeEach(async () => {
      await LicenseService.handleInstallationCreated(mockInstallationEvent);
    });

    it('should allow automerge for free tier', async () => {
      const hasAccess = await LicenseService.hasFeatureAccess(12345, 'automerge');
      expect(hasAccess).toBe(true);
    });

    it('should not allow scheduling for free tier', async () => {
      const hasAccess = await LicenseService.hasFeatureAccess(12345, 'scheduling');
      expect(hasAccess).toBe(false);
    });

    it('should not allow advanced conditions for free tier', async () => {
      const hasAccess = await LicenseService.hasFeatureAccess(12345, 'advanced_conditions');
      expect(hasAccess).toBe(false);
    });
  });

  describe('handleMarketplacePurchase', () => {
    const mockPurchaseEvent: GitHubWebhookEvent = {
      action: 'purchased',
      installation: {
        id: 12345,
        account: { id: 1, login: 'testuser', type: 'User' },
        target_type: 'User',
        permissions: {}
      },
      marketplace_purchase: {
        account: { id: 1, login: 'testuser', type: 'User' },
        plan: {
          id: 2,
          name: 'pro',
          description: 'Pro Plan',
          monthly_price_in_cents: 900,
          yearly_price_in_cents: 9000,
          price_model: 'flat_rate',
          has_free_trial: false,
          bullets: ['Feature 1', 'Feature 2']
        },
        action: 'purchased'
      },
      repository: {
        id: 1,
        name: 'test-repo',
        full_name: 'testuser/test-repo',
        owner: { id: 1, login: 'testuser', type: 'User' },
        private: false,
        default_branch: 'main'
      },
      sender: { id: 1, login: 'testuser', type: 'User' }
    };

    it('should upgrade to pro tier on purchase', async () => {
      await LicenseService.handleMarketplacePurchase(mockPurchaseEvent);
      
      const license = await LicenseService.getLicenseInfo(12345);
      
      expect(license?.tier).toBe('pro');
      expect(license?.is_active).toBe(true);
      expect(license?.expires_at).toBeDefined();
    });

    it('should allow scheduling for pro tier', async () => {
      await LicenseService.handleMarketplacePurchase(mockPurchaseEvent);
      
      const hasAccess = await LicenseService.hasFeatureAccess(12345, 'scheduling');
      expect(hasAccess).toBe(true);
    });
  });
});