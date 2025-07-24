/**
 * Performance Manager for Premium Graphics
 * Optimizes rendering and effects based on device capabilities
 */

export interface PerformanceSettings {
  particleCount: number;
  animationQuality: 'low' | 'medium' | 'high';
  shadowsEnabled: boolean;
  glowEffectsEnabled: boolean;
  backgroundEffectsEnabled: boolean;
  maxConcurrentTweens: number;
  targetFPS: number;
}

export class PerformanceManager {
  private static instance: PerformanceManager;
  private settings: PerformanceSettings;
  private frameRate: number = 60;
  private frameHistory: number[] = [];
  private lastFrameTime: number = 0;
  private isLowPerformanceDevice: boolean = false;

  static getInstance(): PerformanceManager {
    if (!PerformanceManager.instance) {
      PerformanceManager.instance = new PerformanceManager();
    }
    return PerformanceManager.instance;
  }

  constructor() {
    this.settings = this.detectOptimalSettings();
    this.startPerformanceMonitoring();
  }

  /**
   * Detect optimal settings based on device capabilities
   */
  private detectOptimalSettings(): PerformanceSettings {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = this.detectLowEndDevice();
    const hasGoodGPU = this.detectGPUCapabilities();

    if (isLowEndDevice || isMobile) {
      return {
        particleCount: 50,
        animationQuality: 'low',
        shadowsEnabled: false,
        glowEffectsEnabled: false,
        backgroundEffectsEnabled: false,
        maxConcurrentTweens: 5,
        targetFPS: 30
      };
    } else if (!hasGoodGPU) {
      return {
        particleCount: 100,
        animationQuality: 'medium',
        shadowsEnabled: false,
        glowEffectsEnabled: true,
        backgroundEffectsEnabled: true,
        maxConcurrentTweens: 10,
        targetFPS: 45
      };
    } else {
      return {
        particleCount: 200,
        animationQuality: 'high',
        shadowsEnabled: true,
        glowEffectsEnabled: true,
        backgroundEffectsEnabled: true,
        maxConcurrentTweens: 20,
        targetFPS: 60
      };
    }
  }

  /**
   * Detect if device is low-end based on various factors
   */
  private detectLowEndDevice(): boolean {
    // Check memory
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) {
      return true;
    }

    // Check CPU cores
    const cores = navigator.hardwareConcurrency;
    if (cores && cores < 4) {
      return true;
    }

    // Check connection speed
    const connection = (navigator as any).connection;
    if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
      return true;
    }

    return false;
  }

  /**
   * Detect GPU capabilities
   */
  private detectGPUCapabilities(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return false;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        
        // Check for integrated graphics (usually lower performance)
        if (renderer.toLowerCase().includes('intel') && 
            (renderer.toLowerCase().includes('hd') || renderer.toLowerCase().includes('uhd'))) {
          return false;
        }
      }

      // Check for WebGL2 support
      const gl2 = canvas.getContext('webgl2');
      return !!gl2;
    } catch (error) {
      return false;
    }
  }

  /**
   * Start monitoring performance
   */
  private startPerformanceMonitoring(): void {
    const monitor = () => {
      const now = performance.now();
      if (this.lastFrameTime > 0) {
        const frameDelta = now - this.lastFrameTime;
        const currentFPS = 1000 / frameDelta;
        
        this.frameHistory.push(currentFPS);
        if (this.frameHistory.length > 60) {
          this.frameHistory.shift();
        }
        
        // Calculate average FPS
        this.frameRate = this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
        
        // Adjust settings if performance is poor
        this.adjustSettingsBasedOnPerformance();
      }
      
      this.lastFrameTime = now;
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  /**
   * Adjust settings based on current performance
   */
  private adjustSettingsBasedOnPerformance(): void {
    const targetFPS = this.settings.targetFPS;
    const currentFPS = this.frameRate;
    
    if (currentFPS < targetFPS * 0.8) {
      // Performance is poor, reduce quality
      this.reduceQuality();
    } else if (currentFPS > targetFPS * 1.1 && this.settings.animationQuality !== 'high') {
      // Performance is good, can increase quality
      this.increaseQuality();
    }
  }

  /**
   * Reduce graphics quality
   */
  private reduceQuality(): void {
    if (this.settings.animationQuality === 'high') {
      this.settings.animationQuality = 'medium';
      this.settings.particleCount = Math.max(50, this.settings.particleCount * 0.7);
      this.settings.shadowsEnabled = false;
    } else if (this.settings.animationQuality === 'medium') {
      this.settings.animationQuality = 'low';
      this.settings.particleCount = Math.max(25, this.settings.particleCount * 0.5);
      this.settings.glowEffectsEnabled = false;
      this.settings.backgroundEffectsEnabled = false;
    }
    
    this.settings.maxConcurrentTweens = Math.max(3, this.settings.maxConcurrentTweens - 2);
  }

  /**
   * Increase graphics quality
   */
  private increaseQuality(): void {
    if (this.settings.animationQuality === 'low') {
      this.settings.animationQuality = 'medium';
      this.settings.particleCount = Math.min(150, this.settings.particleCount * 1.5);
      this.settings.glowEffectsEnabled = true;
      this.settings.backgroundEffectsEnabled = true;
    } else if (this.settings.animationQuality === 'medium') {
      this.settings.animationQuality = 'high';
      this.settings.particleCount = Math.min(200, this.settings.particleCount * 1.3);
      this.settings.shadowsEnabled = true;
    }
    
    this.settings.maxConcurrentTweens = Math.min(20, this.settings.maxConcurrentTweens + 2);
  }

  /**
   * Get current performance settings
   */
  getSettings(): PerformanceSettings {
    return { ...this.settings };
  }

  /**
   * Get current frame rate
   */
  getFrameRate(): number {
    return this.frameRate;
  }

  /**
   * Check if device is considered low performance
   */
  isLowPerformance(): boolean {
    return this.isLowPerformanceDevice || this.frameRate < 30;
  }

  /**
   * Get optimized particle count for current performance
   */
  getOptimizedParticleCount(baseCount: number): number {
    const multiplier = this.settings.animationQuality === 'high' ? 1 : 
                     this.settings.animationQuality === 'medium' ? 0.6 : 0.3;
    return Math.floor(baseCount * multiplier);
  }

  /**
   * Get optimized animation duration
   */
  getOptimizedDuration(baseDuration: number): number {
    const multiplier = this.settings.animationQuality === 'high' ? 1 : 
                     this.settings.animationQuality === 'medium' ? 0.8 : 0.6;
    return Math.floor(baseDuration * multiplier);
  }

  /**
   * Check if effect should be enabled
   */
  shouldEnableEffect(effectType: 'shadows' | 'glow' | 'background'): boolean {
    switch (effectType) {
      case 'shadows':
        return this.settings.shadowsEnabled;
      case 'glow':
        return this.settings.glowEffectsEnabled;
      case 'background':
        return this.settings.backgroundEffectsEnabled;
      default:
        return true;
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    fps: number;
    quality: string;
    particleCount: number;
    effectsEnabled: number;
    isOptimized: boolean;
  } {
    const effectsEnabled = [
      this.settings.shadowsEnabled,
      this.settings.glowEffectsEnabled,
      this.settings.backgroundEffectsEnabled
    ].filter(Boolean).length;

    return {
      fps: Math.round(this.frameRate),
      quality: this.settings.animationQuality,
      particleCount: this.settings.particleCount,
      effectsEnabled,
      isOptimized: this.frameRate >= this.settings.targetFPS * 0.9
    };
  }

  /**
   * Force quality setting
   */
  setQuality(quality: 'low' | 'medium' | 'high'): void {
    this.settings.animationQuality = quality;
    
    switch (quality) {
      case 'low':
        this.settings.particleCount = 50;
        this.settings.shadowsEnabled = false;
        this.settings.glowEffectsEnabled = false;
        this.settings.backgroundEffectsEnabled = false;
        this.settings.maxConcurrentTweens = 5;
        break;
      case 'medium':
        this.settings.particleCount = 100;
        this.settings.shadowsEnabled = false;
        this.settings.glowEffectsEnabled = true;
        this.settings.backgroundEffectsEnabled = true;
        this.settings.maxConcurrentTweens = 10;
        break;
      case 'high':
        this.settings.particleCount = 200;
        this.settings.shadowsEnabled = true;
        this.settings.glowEffectsEnabled = true;
        this.settings.backgroundEffectsEnabled = true;
        this.settings.maxConcurrentTweens = 20;
        break;
    }
  }

  /**
   * Enable/disable adaptive quality
   */
  setAdaptiveQuality(enabled: boolean): void {
    if (!enabled) {
      // Stop performance monitoring
      this.frameHistory = [];
    }
  }
}

// Export singleton instance
export const performanceManager = PerformanceManager.getInstance();