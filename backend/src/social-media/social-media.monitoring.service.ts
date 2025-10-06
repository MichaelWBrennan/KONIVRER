import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocialMediaProductionConfigService } from './social-media.production.config';

export interface SocialMediaMetrics {
  platform: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastRequestTime: Date;
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';
  errorRate: number;
}

export interface SocialMediaHealthCheck {
  platform: string;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastCheck: Date;
  error?: string;
}

@Injectable()
export class SocialMediaMonitoringService {
  private readonly logger = new Logger(SocialMediaMonitoringService.name);
  private metrics: Map<string, SocialMediaMetrics> = new Map();
  private healthChecks: Map<string, SocialMediaHealthCheck> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly productionConfig: SocialMediaProductionConfigService,
  ) {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    const config = this.productionConfig.getMonitoringConfig();
    
    if (config.enabled) {
      this.startHealthChecks();
      this.logger.log('Social media monitoring initialized');
    } else {
      this.logger.log('Social media monitoring disabled');
    }
  }

  /**
   * Record a social media API request
   */
  recordRequest(
    platform: string,
    success: boolean,
    responseTime: number,
    error?: string
  ): void {
    const existing = this.metrics.get(platform) || {
      platform,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastRequestTime: new Date(),
      healthStatus: 'healthy' as const,
      errorRate: 0,
    };

    existing.totalRequests++;
    existing.lastRequestTime = new Date();
    
    if (success) {
      existing.successfulRequests++;
    } else {
      existing.failedRequests++;
    }

    // Update average response time
    existing.averageResponseTime = 
      (existing.averageResponseTime * (existing.totalRequests - 1) + responseTime) / 
      existing.totalRequests;

    // Update error rate
    existing.errorRate = (existing.failedRequests / existing.totalRequests) * 100;

    // Update health status
    if (existing.errorRate > 50) {
      existing.healthStatus = 'unhealthy';
    } else if (existing.errorRate > 20) {
      existing.healthStatus = 'degraded';
    } else {
      existing.healthStatus = 'healthy';
    }

    this.metrics.set(platform, existing);

    // Log errors
    if (!success && error) {
      this.logger.error(`Social media API error for ${platform}: ${error}`);
    }
  }

  /**
   * Get metrics for a specific platform
   */
  getPlatformMetrics(platform: string): SocialMediaMetrics | null {
    return this.metrics.get(platform) || null;
  }

  /**
   * Get all platform metrics
   */
  getAllMetrics(): SocialMediaMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * Get overall health status
   */
  getOverallHealth(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    platforms: SocialMediaHealthCheck[];
    summary: {
      totalPlatforms: number;
      healthyPlatforms: number;
      degradedPlatforms: number;
      unhealthyPlatforms: number;
    };
  } {
    const platforms = Array.from(this.healthChecks.values());
    const healthy = platforms.filter(p => p.status === 'up').length;
    const degraded = platforms.filter(p => p.status === 'degraded').length;
    const unhealthy = platforms.filter(p => p.status === 'down').length;

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
    if (unhealthy > 0) {
      overallStatus = 'unhealthy';
    } else if (degraded > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    return {
      status: overallStatus,
      platforms,
      summary: {
        totalPlatforms: platforms.length,
        healthyPlatforms: healthy,
        degradedPlatforms: degraded,
        unhealthyPlatforms: unhealthy,
      },
    };
  }

  /**
   * Start health checks for all enabled platforms
   */
  private startHealthChecks(): void {
    const config = this.productionConfig.getMonitoringConfig();
    
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, config.healthCheckInterval);
  }

  /**
   * Perform health checks for all platforms
   */
  private async performHealthChecks(): Promise<void> {
    const enabledPlatforms = this.productionConfig.getEnabledPlatforms();
    
    for (const platform of enabledPlatforms) {
      try {
        await this.checkPlatformHealth(platform);
      } catch (error) {
        this.logger.error(`Health check failed for ${platform}:`, error);
        this.healthChecks.set(platform, {
          platform,
          status: 'down',
          responseTime: 0,
          lastCheck: new Date(),
          error: error.message,
        });
      }
    }
  }

  /**
   * Check health of a specific platform
   */
  private async checkPlatformHealth(platform: string): Promise<void> {
    const startTime = Date.now();
    
    try {
      // This would perform actual health checks for each platform
      // For now, simulate health checks
      const responseTime = Date.now() - startTime;
      
      let status: 'up' | 'down' | 'degraded' = 'up';
      
      // Simulate different health states based on response time
      if (responseTime > 5000) {
        status = 'down';
      } else if (responseTime > 2000) {
        status = 'degraded';
      }

      this.healthChecks.set(platform, {
        platform,
        status,
        responseTime,
        lastCheck: new Date(),
      });

      this.logger.debug(`Health check for ${platform}: ${status} (${responseTime}ms)`);
    } catch (error) {
      this.healthChecks.set(platform, {
        platform,
        status: 'down',
        responseTime: Date.now() - startTime,
        lastCheck: new Date(),
        error: error.message,
      });
    }
  }

  /**
   * Get platform-specific health check
   */
  getPlatformHealth(platform: string): SocialMediaHealthCheck | null {
    return this.healthChecks.get(platform) || null;
  }

  /**
   * Reset metrics for a platform
   */
  resetPlatformMetrics(platform: string): void {
    this.metrics.delete(platform);
    this.logger.log(`Reset metrics for platform: ${platform}`);
  }

  /**
   * Reset all metrics
   */
  resetAllMetrics(): void {
    this.metrics.clear();
    this.logger.log('Reset all social media metrics');
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(): {
    totalRequests: number;
    totalSuccessful: number;
    totalFailed: number;
    averageResponseTime: number;
    overallErrorRate: number;
    platformBreakdown: Record<string, {
      requests: number;
      successRate: number;
      averageResponseTime: number;
    }>;
  } {
    const allMetrics = this.getAllMetrics();
    
    const totalRequests = allMetrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const totalSuccessful = allMetrics.reduce((sum, m) => sum + m.successfulRequests, 0);
    const totalFailed = allMetrics.reduce((sum, m) => sum + m.failedRequests, 0);
    const averageResponseTime = allMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / allMetrics.length || 0;
    const overallErrorRate = totalRequests > 0 ? (totalFailed / totalRequests) * 100 : 0;

    const platformBreakdown: Record<string, any> = {};
    allMetrics.forEach(metric => {
      platformBreakdown[metric.platform] = {
        requests: metric.totalRequests,
        successRate: metric.totalRequests > 0 ? (metric.successfulRequests / metric.totalRequests) * 100 : 0,
        averageResponseTime: metric.averageResponseTime,
      };
    });

    return {
      totalRequests,
      totalSuccessful,
      totalFailed,
      averageResponseTime,
      overallErrorRate,
      platformBreakdown,
    };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.logger.log('Social media monitoring stopped');
  }

  /**
   * Export metrics for external monitoring systems
   */
  exportMetrics(): {
    timestamp: string;
    metrics: SocialMediaMetrics[];
    health: SocialMediaHealthCheck[];
    summary: any;
  } {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.getAllMetrics(),
      health: Array.from(this.healthChecks.values()),
      summary: this.getMetricsSummary(),
    };
  }
}