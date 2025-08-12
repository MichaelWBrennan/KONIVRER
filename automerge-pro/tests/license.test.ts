import { LicenseService } from '../src/services/license';
import { BillingTier } from '../src/types';

// Mock AWS SDK
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      get: jest.fn(),
      put: jest.fn(),
      update: jest.fn()
    }))
  }
}));

describe('LicenseService', () => {
  let licenseService: LicenseService;
  let mockDynamoDB: any;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    licenseService = new LicenseService('test-table');
    mockDynamoDB = (licenseService as any).dynamodb;
  });

  describe('validateLicense', () => {
    test('should return default free license for new installations', async () => {
      mockDynamoDB.get.mockReturnValueOnce({
        promise: () => Promise.resolve({ Item: null })
      });

      const license = await licenseService.validateLicense(12345);
      
      expect(license).not.toBeNull();
      expect(license!.tier).toBe('free');
      expect(license!.isActive).toBe(true);
      expect(license!.features).toContain('basic_merge');
      expect(license!.features).toContain('status_checks');
    });

    test('should return existing active license', async () => {
      const mockLicense = {
        installationId: 12345,
        tier: 'pro',
        features: ['basic_merge', 'status_checks', 'advanced_rules'],
        isActive: true
      };

      mockDynamoDB.get.mockReturnValueOnce({
        promise: () => Promise.resolve({ Item: mockLicense })
      });

      const license = await licenseService.validateLicense(12345);
      
      expect(license).toEqual(mockLicense);
    });

    test('should handle expired license', async () => {
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);

      const mockLicense = {
        installationId: 12345,
        tier: 'pro',
        features: ['basic_merge', 'status_checks', 'advanced_rules'],
        isActive: true,
        expiresAt: expiredDate.toISOString()
      };

      mockDynamoDB.get.mockReturnValueOnce({
        promise: () => Promise.resolve({ Item: mockLicense })
      });

      const license = await licenseService.validateLicense(12345);
      
      expect(license!.isActive).toBe(false);
      expect(license!.tier).toBe('free');
    });
  });

  describe('startTrial', () => {
    test('should create trial license', async () => {
      mockDynamoDB.put.mockReturnValueOnce({
        promise: () => Promise.resolve()
      });

      const result = await licenseService.startTrial(12345, 'pro', 14);
      
      expect(result).toBe(true);
      expect(mockDynamoDB.put).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: 'test-table',
          Item: expect.objectContaining({
            installationId: 12345,
            tier: 'pro',
            isActive: true,
            trialEndsAt: expect.any(String)
          })
        })
      );
    });
  });

  describe('processMarketplacePurchase', () => {
    test('should process pro plan purchase', async () => {
      const purchaseData = {
        account: { id: 12345 },
        marketplace_purchase: {
          id: 'purchase-123',
          plan: {
            id: 'plan-pro',
            name: 'Automerge-Pro Plan'
          }
        }
      };

      mockDynamoDB.put.mockReturnValueOnce({
        promise: () => Promise.resolve()
      });

      const result = await licenseService.processMarketplacePurchase(purchaseData);
      
      expect(result).toBe(true);
      expect(mockDynamoDB.put).toHaveBeenCalledWith(
        expect.objectContaining({
          Item: expect.objectContaining({
            installationId: 12345,
            tier: 'pro'
          })
        })
      );
    });
  });

  describe('feature access', () => {
    test('should have correct features for each tier', () => {
      const service = new LicenseService();
      
      expect((service as any).getFeaturesForTier('free')).toEqual([
        'basic_merge', 'status_checks'
      ]);
      
      expect((service as any).getFeaturesForTier('pro')).toEqual([
        'basic_merge', 'status_checks', 'advanced_rules', 'notifications', 'analytics'
      ]);
      
      expect((service as any).getFeaturesForTier('enterprise')).toEqual([
        'basic_merge', 'status_checks', 'advanced_rules', 'notifications', 'analytics', 'custom_actions', 'audit_logs', 'sso'
      ]);
    });
  });
});