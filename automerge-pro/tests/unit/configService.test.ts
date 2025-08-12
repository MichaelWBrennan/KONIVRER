import { ConfigService } from '../../src/services/configService';

describe('ConfigService', () => {
  describe('validateConfig', () => {
    it('should validate a correct configuration', async () => {
      const validConfig = `
enabled: true
strategy: merge
conditions:
  required_status_checks:
    - "ci/tests"
  required_reviews: 1
  dismiss_stale_reviews: false
  require_code_owner_reviews: false
`;

      const result = await ConfigService.validateConfig(validConfig);
      
      expect(result.valid).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.config?.enabled).toBe(true);
      expect(result.config?.strategy).toBe('merge');
    });

    it('should reject invalid strategy', async () => {
      const invalidConfig = `
enabled: true
strategy: invalid_strategy
conditions:
  required_reviews: 1
`;

      const result = await ConfigService.validateConfig(invalidConfig);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('"strategy" must be one of [merge, squash, rebase]');
    });

    it('should handle invalid YAML', async () => {
      const invalidYaml = `
enabled: true
strategy: [invalid yaml structure
`;

      const result = await ConfigService.validateConfig(invalidYaml);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid YAML syntax');
    });
  });

  describe('getDefaultConfig', () => {
    it('should return a valid default configuration', async () => {
      const config = await ConfigService.getDefaultConfig();
      
      expect(config.enabled).toBe(true);
      expect(config.strategy).toBe('merge');
      expect(config.conditions.required_reviews).toBe(1);
      expect(config.conditions.required_status_checks).toEqual([]);
    });
  });

  describe('getConfigTemplate', () => {
    it('should return a valid YAML template', () => {
      const template = ConfigService.getConfigTemplate();
      
      expect(template).toContain('enabled:');
      expect(template).toContain('strategy:');
      expect(template).toContain('conditions:');
      expect(template).toContain('required_status_checks:');
    });
  });
});