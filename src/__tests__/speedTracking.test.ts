/**
 * Speed Tracking Utilities Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the build detection utility
vi.mock('../utils/buildDetection', () => ({
  shouldSkipAutonomousSystems: vi.fn(() => false),
}));

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => 1000),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
};

// Mock window object
Object.defineProperty(global, 'window', {
  value: {
    performance: mockPerformance,
    location: { href: 'http://localhost:3000' },
    navigator: { userAgent: 'test-agent' },
  },
  writable: true,
});

Object.defineProperty(global, 'document', {
  value: {
    readyState: 'complete',
    addEventListener: vi.fn(),
    body: {},
  },
  writable: true,
});

describe('Speed Tracking Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export tracking functions', async () => {
    const { trackCustomMetric, trackAsyncOperation, getPerformanceReport } =
      await import('../utils/speedTracking');

    expect(typeof trackCustomMetric).toBe('function');
    expect(typeof trackAsyncOperation).toBe('function');
    expect(typeof getPerformanceReport).toBe('function');
  });

  it('should track custom metrics', async () => {
    const { trackCustomMetric } = await import('../utils/speedTracking');

    // Should not throw when tracking metrics
    expect(() => {
      trackCustomMetric('TEST_METRIC', 100);
    }).not.toThrow();
  });

  it('should track async operations', async () => {
    const { trackAsyncOperation } = await import('../utils/speedTracking');

    const mockOperation = vi.fn().mockResolvedValue('success');

    const result = await trackAsyncOperation('TEST_ASYNC', mockOperation);

    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalled();
  });

  it('should handle async operation errors', async () => {
    const { trackAsyncOperation } = await import('../utils/speedTracking');

    const mockOperation = vi.fn().mockRejectedValue(new Error('test error'));

    await expect(
      trackAsyncOperation('TEST_ERROR', mockOperation),
    ).rejects.toThrow('test error');
    expect(mockOperation).toHaveBeenCalled();
  });

  it('should generate performance reports', async () => {
    const { getPerformanceReport } = await import('../utils/speedTracking');

    const report = getPerformanceReport();

    expect(typeof report).toBe('string');
    expect(() => JSON.parse(report)).not.toThrow();

    const parsed = JSON.parse(report);
    expect(parsed).toHaveProperty('timestamp');
    expect(parsed).toHaveProperty('url');
    expect(parsed).toHaveProperty('userAgent');
    expect(parsed).toHaveProperty('metrics');
    expect(parsed).toHaveProperty('summary');
  });

  it('should handle missing performance API gracefully', async () => {
    // Temporarily remove performance API
    const originalPerformance = global.window.performance;
    // @ts-ignore
    delete global.window.performance;

    const { trackCustomMetric } = await import('../utils/speedTracking');

    // Should not throw even without performance API
    expect(() => {
      trackCustomMetric('TEST_METRIC', 100);
    }).not.toThrow();

    // Restore performance API
    global.window.performance = originalPerformance;
  });
});
