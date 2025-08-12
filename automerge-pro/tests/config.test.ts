import { validateConfig, validateFeatureAccess } from '../src/schemas/config';
import { BillingTier } from '../src/types';

describe('Configuration Validation', () => {
  test('should validate basic configuration', () => {
    const config = {
      version: '2.0',
      rules: [{
        name: 'auto-merge',
        enabled: true,
        conditions: ['status_checks_passed'],
        actions: [{ type: 'squash' }],
        priority: 50
      }],
      conditions: {
        required_status_checks: ['ci/build'],
        required_reviews: 1
      },
      notifications: {
        channels: [],
        events: []
      }
    };

    const { error, value } = validateConfig(config);
    expect(error).toBeUndefined();
    expect(value).toBeDefined();
    expect(value!.version).toBe('2.0');
  });

  test('should reject invalid configuration', () => {
    const config = {
      version: '2.0',
      rules: [], // Empty rules should fail
      conditions: {}
    };

    const { error } = validateConfig(config);
    expect(error).toBeDefined();
  });

  test('should validate feature access correctly', () => {
    expect(validateFeatureAccess('free', 'basic_merge')).toBe(true);
    expect(validateFeatureAccess('free', 'advanced_rules')).toBe(false);
    expect(validateFeatureAccess('pro', 'advanced_rules')).toBe(true);
    expect(validateFeatureAccess('pro', 'custom_actions')).toBe(false);
    expect(validateFeatureAccess('enterprise', 'custom_actions')).toBe(true);
  });
});

describe('Feature Gating', () => {
  const tiers: BillingTier[] = ['free', 'pro', 'enterprise'];
  
  test('should have proper feature hierarchy', () => {
    // Free tier features
    expect(validateFeatureAccess('free', 'basic_merge')).toBe(true);
    expect(validateFeatureAccess('free', 'status_checks')).toBe(true);
    
    // Pro tier should include free features
    expect(validateFeatureAccess('pro', 'basic_merge')).toBe(true);
    expect(validateFeatureAccess('pro', 'status_checks')).toBe(true);
    expect(validateFeatureAccess('pro', 'advanced_rules')).toBe(true);
    
    // Enterprise should include all features
    expect(validateFeatureAccess('enterprise', 'basic_merge')).toBe(true);
    expect(validateFeatureAccess('enterprise', 'advanced_rules')).toBe(true);
    expect(validateFeatureAccess('enterprise', 'custom_actions')).toBe(true);
    expect(validateFeatureAccess('enterprise', 'audit_logs')).toBe(true);
  });
});