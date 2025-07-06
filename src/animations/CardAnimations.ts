/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Advanced Card Animation System
 *
 * A state-of-the-art animation system for card interactions that provides:
 * - 3D perspective animations
 * - Particle effects
 * - Dynamic lighting
 * - Card-specific animations
 * - Performance-optimized rendering
 * - Cross-device compatibility
 */

// Import dependencies - commented out until we install them
// import { gsap } from 'gsap';
// import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
// import { PixiPlugin } from 'gsap/PixiPlugin';
import { createParticleSystem } from './ParticleSystem';
import { getCardSpecificAnimations } from './CardSpecificAnimations';

// Animation types
export interface AnimationOptions {
  duration?: number;
  ease?: string;
  delay?: number;
  repeat?: number;
  yoyo?: boolean;
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  [key: string]: any;
}

export interface CardAnimationOptions extends AnimationOptions {
  element: HTMLElement;
  type: AnimationType;
  particleEffect?: ParticleEffectType;
  lightingEffect?: LightingEffectType;
  soundEffect?: boolean;
  perspective?: boolean;
  cardData?: CardData;
  [key: string]: any;
}

export interface TimelineOptions {
  paused?: boolean;
  repeat?: number;
  yoyo?: boolean;
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  [key: string]: any;
}

export interface ParticleOptions {
  type: ParticleEffectType;
  count: number;
  duration: number;
  color?: string | string[];
  size?: number | [number, number];
  speed?: number | [number, number];
  direction?: number | [number, number];
  gravity?: number;
  opacity?: number | [number, number];
  [key: string]: any;
}

export interface LightingOptions {
  type: LightingEffectType;
  color: string;
  intensity: number;
  duration: number;
  decay?: number;
  [key: string]: any;
}

export interface CardData {
  id: string;
  name: string;
  type: string;
  elements: string[];
  rarity: string;
  [key: string]: any;
}

export enum AnimationType {
  DRAW = 'draw',
  PLAY = 'play',
  ATTACK = 'attack',
  BLOCK = 'block',
  DESTROY = 'destroy',
  SHUFFLE = 'shuffle',
  FLIP = 'flip',
  HOVER = 'hover',
  TAP = 'tap',
  UNTAP = 'untap',
  HIGHLIGHT = 'highlight',
  MOVE = 'move',
  BOUNCE = 'bounce',
  SHAKE = 'shake',
  PULSE = 'pulse',
  GLOW = 'glow',
  FADE_IN = 'fadeIn',
  FADE_OUT = 'fadeOut',
  CUSTOM = 'custom'
}

export enum ParticleEffectType {
  NONE = 'none',
  FIRE = 'fire',
  WATER = 'water',
  EARTH = 'earth',
  AIR = 'air',
  AETHER = 'aether',
  NETHER = 'nether',
  SPARKLE = 'sparkle',
  SMOKE = 'smoke',
  EXPLOSION = 'explosion',
  SHATTER = 'shatter',
  LEAVES = 'leaves',
  BUBBLES = 'bubbles',
  LIGHTNING = 'lightning',
  DUST = 'dust',
  CUSTOM = 'custom'
}

export enum LightingEffectType {
  NONE = 'none',
  FLASH = 'flash',
  PULSE = 'pulse',
  GLOW = 'glow',
  RADIAL = 'radial',
  DIRECTIONAL = 'directional',
  AMBIENT = 'ambient',
  CUSTOM = 'custom'
}

// Create a mock gsap object until we can install the real one
interface MockGSAP {
  registerPlugin: (...args: any[]) => void;
  set: (target: any, vars: any) => any;
  timeline: (options?: TimelineOptions) => MockTimeline;
  to: (target: any, duration: number, vars: any) => MockTween;
  from: (target: any, duration: number, vars: any) => MockTween;
  fromTo: (target: any, duration: number, fromVars: any, toVars: any) => MockTween;
  [key: string]: any;
}

interface MockTimeline {
  to: (target: any, duration: number, vars: any, position?: string | number) => MockTimeline;
  from: (target: any, duration: number, vars: any, position?: string | number) => MockTimeline;
  fromTo: (target: any, duration: number, fromVars: any, toVars: any, position?: string | number) => MockTimeline;
  set: (target: any, vars: any, position?: string | number) => MockTimeline;
  add: (child: any, position?: string | number) => MockTimeline;
  addLabel: (label: string, position?: string | number) => MockTimeline;
  play: (from?: string | number) => MockTimeline;
  pause: (atTime?: string | number) => MockTimeline;
  resume: () => MockTimeline;
  reverse: (from?: string | number) => MockTimeline;
  restart: (includeDelay?: boolean, suppressEvents?: boolean) => MockTimeline;
  seek: (position: string | number) => MockTimeline;
  progress: (value?: number) => number | MockTimeline;
  time: (value?: number) => number | MockTimeline;
  duration: (value?: number) => number | MockTimeline;
  totalDuration: (value?: number) => number | MockTimeline;
  timeScale: (value?: number) => number | MockTimeline;
  delay: (value?: number) => number | MockTimeline;
  repeat: (value?: number) => number | MockTimeline;
  repeatDelay: (value?: number) => number | MockTimeline;
  yoyo: (value?: boolean) => boolean | MockTimeline;
  kill: (vars?: any) => MockTimeline;
  clear: (suppressEvents?: boolean) => MockTimeline;
  onStart: (callback: () => void) => MockTimeline;
  onUpdate: (callback: (progress: number) => void) => MockTimeline;
  onComplete: (callback: () => void) => MockTimeline;
  [key: string]: any;
}

interface MockTween {
  play: () => MockTween;
  pause: () => MockTween;
  resume: () => MockTween;
  reverse: () => MockTween;
  restart: (includeDelay?: boolean, suppressEvents?: boolean) => MockTween;
  seek: (position: number) => MockTween;
  progress: (value?: number) => number | MockTween;
  time: (value?: number) => number | MockTween;
  duration: (value?: number) => number | MockTween;
  delay: (value?: number) => number | MockTween;
  repeat: (value?: number) => number | MockTween;
  repeatDelay: (value?: number) => number | MockTween;
  yoyo: (value?: boolean) => boolean | MockTween;
  kill: (vars?: any) => MockTween;
  onStart: (callback: () => void) => MockTween;
  onUpdate: (callback: (progress: number) => void) => MockTween;
  onComplete: (callback: () => void) => MockTween;
  [key: string]: any;
}

const gsap: MockGSAP = {
  registerPlugin: (...args: any[]) => {},
  set: (target: any, vars: any) => ({}),
  timeline: (options?: TimelineOptions) => ({
    to: (target: any, duration: number, vars: any, position?: string | number) => ({} as MockTimeline),
    from: (target: any, duration: number, vars: any, position?: string | number) => ({} as MockTimeline),
    fromTo: (target: any, duration: number, fromVars: any, toVars: any, position?: string | number) => ({} as MockTimeline),
    set: (target: any, vars: any, position?: string | number) => ({} as MockTimeline),
    add: (child: any, position?: string | number) => ({} as MockTimeline),
    addLabel: (label: string, position?: string | number) => ({} as MockTimeline),
    play: (from?: string | number) => ({} as MockTimeline),
    pause: (atTime?: string | number) => ({} as MockTimeline),
    resume: () => ({} as MockTimeline),
    reverse: (from?: string | number) => ({} as MockTimeline),
    restart: (includeDelay?: boolean, suppressEvents?: boolean) => ({} as MockTimeline),
    seek: (position: string | number) => ({} as MockTimeline),
    progress: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    time: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    duration: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    totalDuration: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    timeScale: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    delay: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    repeat: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    repeatDelay: (value?: number) => (value !== undefined ? ({} as MockTimeline) : 0),
    yoyo: (value?: boolean) => (value !== undefined ? ({} as MockTimeline) : false),
    kill: (vars?: any) => ({} as MockTimeline),
    clear: (suppressEvents?: boolean) => ({} as MockTimeline),
    onStart: (callback: () => void) => ({} as MockTimeline),
    onUpdate: (callback: (progress: number) => void) => ({} as MockTimeline),
    onComplete: (callback: () => void) => ({} as MockTimeline)
  }),
  to: (target: any, duration: number, vars: any) => ({} as MockTween),
  from: (target: any, duration: number, vars: any) => ({} as MockTween),
  fromTo: (target: any, duration: number, fromVars: any, toVars: any) => ({} as MockTween)
};

// Register GSAP plugins - commented out until we install the real plugins
// gsap.registerPlugin(MotionPathPlugin, PixiPlugin);

/**
 * Animation system configuration
 */
interface AnimationConfig {
  enabled: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  particlesEnabled: boolean;
  lightingEnabled: boolean;
  soundEnabled: boolean;
  perspectiveEnabled: boolean;
  performanceMode: boolean;
  debugMode: boolean;
  [key: string]: any;
}

let config: AnimationConfig = {
  enabled: true,
  quality: 'medium',
  particlesEnabled: true,
  lightingEnabled: true,
  soundEnabled: true,
  perspectiveEnabled: true,
  performanceMode: false,
  debugMode: false
};

/**
 * Configure the animation system
 */
export function configureAnimations(options: Partial<AnimationConfig>): void {
  config = { ...config, ...options };
  
  // Apply configuration changes
  if (config.performanceMode) {
    config.quality = 'low';
    config.particlesEnabled = false;
    config.lightingEnabled = false;
    config.perspectiveEnabled = false;
  }
  
  if (config.debugMode) {
    console.log('Animation system configured:', config);
  }
}

/**
 * Get current animation configuration
 */
export function getAnimationConfig(): AnimationConfig {
  return { ...config };
}

/**
 * Create a card animation
 */
export function animateCard(options: CardAnimationOptions): void {
  if (!config.enabled) return;
  
  const { element, type, particleEffect, lightingEffect, soundEffect, perspective, cardData } = options;
  
  if (!element) {
    console.error('Cannot animate card: No element provided');
    return;
  }
  
  // Apply perspective if enabled
  if (perspective && config.perspectiveEnabled) {
    applyPerspective(element);
  }
  
  // Get animation based on type
  const animation = getAnimationByType(type, element, options);
  
  // Add particle effects if enabled
  if (particleEffect && config.particlesEnabled) {
    addParticleEffect(element, particleEffect, cardData);
  }
  
  // Add lighting effects if enabled
  if (lightingEffect && config.lightingEnabled) {
    addLightingEffect(element, lightingEffect, cardData);
  }
  
  // Add sound effects if enabled
  if (soundEffect && config.soundEnabled) {
    playSoundEffect(type, cardData);
  }
  
  // Play animation
  animation.play();
}

/**
 * Apply 3D perspective to an element
 */
function applyPerspective(element: HTMLElement): void {
  const parent = element.parentElement;
  if (parent) {
    gsap.set(parent, {
      perspective: 800
    });
    
    gsap.set(element, {
      transformStyle: 'preserve-3d'
    });
  }
}

/**
 * Get animation based on type
 */
function getAnimationByType(
  type: AnimationType,
  element: HTMLElement,
  options: CardAnimationOptions
): MockTimeline {
  const timeline = gsap.timeline({
    paused: true,
    onStart: options.onStart,
    onUpdate: options.onUpdate,
    onComplete: options.onComplete
  });
  
  const duration = options.duration || 0.5;
  const ease = options.ease || 'power2.out';
  
  switch (type) {
    case AnimationType.DRAW:
      return createDrawAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.PLAY:
      return createPlayAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.ATTACK:
      return createAttackAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.BLOCK:
      return createBlockAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.DESTROY:
      return createDestroyAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.SHUFFLE:
      return createShuffleAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.FLIP:
      return createFlipAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.HOVER:
      return createHoverAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.TAP:
      return createTapAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.UNTAP:
      return createUntapAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.HIGHLIGHT:
      return createHighlightAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.MOVE:
      return createMoveAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.BOUNCE:
      return createBounceAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.SHAKE:
      return createShakeAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.PULSE:
      return createPulseAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.GLOW:
      return createGlowAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.FADE_IN:
      return createFadeInAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.FADE_OUT:
      return createFadeOutAnimation(element, timeline, duration, ease, options);
    
    case AnimationType.CUSTOM:
      return createCustomAnimation(element, timeline, duration, ease, options);
    
    default:
      console.warn(`Unknown animation type: ${type}`);
      return timeline;
  }
}

/**
 * Create draw animation
 */
function createDrawAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const startX = options.startX || -300;
  const startY = options.startY || 100;
  const startRotation = options.startRotation || 45;
  
  gsap.set(element, {
    x: startX,
    y: startY,
    rotation: startRotation,
    scale: 0.8,
    opacity: 0
  });
  
  timeline.to(element, {
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    opacity: 1,
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create play animation
 */
function createPlayAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const startScale = options.startScale || 1.2;
  const startY = options.startY || -50;
  
  gsap.set(element, {
    y: startY,
    scale: startScale,
    opacity: 0.8
  });
  
  timeline
    .to(element, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: duration * 0.7,
      ease: 'back.out(1.7)'
    })
    .to(element, {
      y: -10,
      duration: duration * 0.15,
      ease: 'power1.out'
    })
    .to(element, {
      y: 0,
      duration: duration * 0.15,
      ease: 'bounce.out'
    });
  
  return timeline;
}

/**
 * Create attack animation
 */
function createAttackAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const distance = options.distance || 100;
  
  timeline
    .to(element, {
      x: distance,
      rotation: 5,
      scale: 1.1,
      duration: duration * 0.4,
      ease: 'power2.in'
    })
    .to(element, {
      x: 0,
      rotation: 0,
      scale: 1,
      duration: duration * 0.6,
      ease: 'power1.out'
    });
  
  return timeline;
}

/**
 * Create block animation
 */
function createBlockAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  timeline
    .to(element, {
      scale: 1.1,
      rotation: -5,
      duration: duration * 0.3,
      ease: 'power1.out'
    })
    .to(element, {
      scale: 1,
      rotation: 0,
      duration: duration * 0.7,
      ease
    });
  
  return timeline;
}

/**
 * Create destroy animation
 */
function createDestroyAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  timeline
    .to(element, {
      rotation: options.rotation || 10,
      scale: 1.2,
      opacity: 0.8,
      duration: duration * 0.3,
      ease: 'power2.in'
    })
    .to(element, {
      rotation: options.finalRotation || 30,
      scale: 0,
      opacity: 0,
      duration: duration * 0.7,
      ease
    });
  
  return timeline;
}

/**
 * Create shuffle animation
 */
function createShuffleAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const rotationAmount = options.rotation || 360;
  
  timeline
    .to(element, {
      rotation: rotationAmount,
      scale: 0.8,
      opacity: 0.8,
      duration: duration,
      ease
    })
    .to(element, {
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: duration * 0.5,
      ease: 'power1.out'
    });
  
  return timeline;
}

/**
 * Create flip animation
 */
function createFlipAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const axis = options.axis || 'Y';
  
  timeline.to(element, {
    [`rotate${axis}`]: '+=180',
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create hover animation
 */
function createHoverAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const scale = options.scale || 1.1;
  const yOffset = options.yOffset || -10;
  
  timeline.to(element, {
    y: yOffset,
    scale,
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create tap animation
 */
function createTapAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  timeline.to(element, {
    rotation: 90,
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create untap animation
 */
function createUntapAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  timeline.to(element, {
    rotation: 0,
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create highlight animation
 */
function createHighlightAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const color = options.color || 'rgba(255, 215, 0, 0.5)';
  
  timeline
    .to(element, {
      boxShadow: `0 0 20px ${color}`,
      duration: duration * 0.5,
      ease: 'power2.in'
    })
    .to(element, {
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      duration: duration * 0.5,
      ease: 'power2.out'
    });
  
  return timeline;
}

/**
 * Create move animation
 */
function createMoveAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const x = options.x || 0;
  const y = options.y || 0;
  
  timeline.to(element, {
    x,
    y,
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create bounce animation
 */
function createBounceAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const height = options.height || 30;
  
  timeline
    .to(element, {
      y: -height,
      duration: duration * 0.5,
      ease: 'power2.out'
    })
    .to(element, {
      y: 0,
      duration: duration * 0.5,
      ease: 'bounce.out'
    });
  
  return timeline;
}

/**
 * Create shake animation
 */
function createShakeAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const intensity = options.intensity || 10;
  const repeat = options.repeat || 5;
  
  for (let i = 0; i < repeat; i++) {
    timeline
      .to(element, {
        x: i % 2 ? intensity : -intensity,
        duration: duration / (repeat * 2),
        ease: 'power1.inOut'
      })
      .to(element, {
        x: 0,
        duration: duration / (repeat * 2),
        ease: 'power1.inOut'
      });
  }
  
  return timeline;
}

/**
 * Create pulse animation
 */
function createPulseAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const scale = options.scale || 1.1;
  
  timeline
    .to(element, {
      scale,
      duration: duration * 0.5,
      ease: 'power2.in'
    })
    .to(element, {
      scale: 1,
      duration: duration * 0.5,
      ease: 'power2.out'
    });
  
  return timeline;
}

/**
 * Create glow animation
 */
function createGlowAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  const color = options.color || 'rgba(255, 255, 255, 0.8)';
  const intensity = options.intensity || 20;
  
  timeline
    .to(element, {
      boxShadow: `0 0 ${intensity}px ${color}`,
      duration: duration * 0.5,
      ease: 'power2.in'
    })
    .to(element, {
      boxShadow: `0 0 ${intensity / 2}px ${color}`,
      duration: duration * 0.5,
      ease: 'power2.out',
      repeat: options.repeat || -1,
      yoyo: true
    });
  
  return timeline;
}

/**
 * Create fade in animation
 */
function createFadeInAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  gsap.set(element, {
    opacity: 0
  });
  
  timeline.to(element, {
    opacity: 1,
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create fade out animation
 */
function createFadeOutAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  timeline.to(element, {
    opacity: 0,
    duration,
    ease
  });
  
  return timeline;
}

/**
 * Create custom animation
 */
function createCustomAnimation(
  element: HTMLElement,
  timeline: MockTimeline,
  duration: number,
  ease: string,
  options: CardAnimationOptions
): MockTimeline {
  // Check if card has specific animations
  if (options.cardData) {
    const cardSpecificAnimation = getCardSpecificAnimations(options.cardData);
    if (cardSpecificAnimation) {
      return cardSpecificAnimation(element, timeline, duration, ease, options);
    }
  }
  
  // Fallback to a generic animation
  timeline.to(element, {
    scale: 1.1,
    rotation: 5,
    duration: duration * 0.5,
    ease: 'power2.in'
  }).to(element, {
    scale: 1,
    rotation: 0,
    duration: duration * 0.5,
    ease: 'power2.out'
  });
  
  return timeline;
}

/**
 * Add particle effect to an element
 */
function addParticleEffect(
  element: HTMLElement,
  effectType: ParticleEffectType,
  cardData?: CardData
): void {
  if (!config.particlesEnabled) return;
  
  // Adjust particle options based on quality setting
  const qualityMultiplier = {
    low: 0.3,
    medium: 0.7,
    high: 1.0,
    ultra: 1.5
  }[config.quality];
  
  const options: ParticleOptions = {
    type: effectType,
    count: Math.floor(30 * qualityMultiplier),
    duration: 1.0,
    size: [3, 8],
    speed: [1, 3],
    direction: [0, 360],
    gravity: 0.1,
    opacity: [0.6, 1.0]
  };
  
  // Adjust options based on effect type
  switch (effectType) {
    case ParticleEffectType.FIRE:
      options.color = ['#ff4500', '#ff8c00', '#ffd700'];
      options.gravity = -0.1;
      break;
    case ParticleEffectType.WATER:
      options.color = ['#00bfff', '#1e90ff', '#87cefa'];
      options.gravity = 0.2;
      break;
    case ParticleEffectType.EARTH:
      options.color = ['#8b4513', '#a0522d', '#cd853f'];
      options.gravity = 0.3;
      break;
    case ParticleEffectType.AIR:
      options.color = ['#f0f8ff', '#e6e6fa', '#b0e0e6'];
      options.gravity = -0.05;
      break;
    case ParticleEffectType.AETHER:
      options.color = ['#9370db', '#8a2be2', '#9400d3'];
      options.gravity = -0.2;
      break;
    case ParticleEffectType.NETHER:
      options.color = ['#4b0082', '#800080', '#8b008b'];
      options.gravity = 0.15;
      break;
    case ParticleEffectType.SPARKLE:
      options.color = ['#ffffff', '#fffacd', '#ffd700'];
      options.gravity = 0;
      options.size = [1, 3];
      break;
    case ParticleEffectType.EXPLOSION:
      options.color = ['#ff4500', '#ff8c00', '#ffd700', '#ffffff'];
      options.count = Math.floor(50 * qualityMultiplier);
      options.speed = [3, 8];
      break;
    default:
      break;
  }
  
  // Create particle system
  createParticleSystem(element, options);
}

/**
 * Add lighting effect to an element
 */
function addLightingEffect(
  element: HTMLElement,
  effectType: LightingEffectType,
  cardData?: CardData
): void {
  if (!config.lightingEnabled) return;
  
  // Get element position and dimensions
  const rect = element.getBoundingClientRect();
  
  // Create lighting element
  const lightElement = document.createElement('div');
  lightElement.className = 'card-lighting-effect';
  lightElement.style.position = 'absolute';
  lightElement.style.left = `${rect.left}px`;
  lightElement.style.top = `${rect.top}px`;
  lightElement.style.width = `${rect.width}px`;
  lightElement.style.height = `${rect.height}px`;
  lightElement.style.pointerEvents = 'none';
  lightElement.style.zIndex = '1000';
  
  // Determine color based on card elements if available
  let color = '#ffffff';
  if (cardData && cardData.elements && cardData.elements.length > 0) {
    const elementColors: Record<string, string> = {
      fire: '#ff4500',
      water: '#1e90ff',
      earth: '#8b4513',
      air: '#e6e6fa',
      aether: '#9370db',
      nether: '#4b0082'
    };
    
    color = elementColors[cardData.elements[0].toLowerCase()] || color;
  }
  
  // Configure lighting based on effect type
  const options: LightingOptions = {
    type: effectType,
    color,
    intensity: 0.8,
    duration: 1.0
  };
  
  // Apply lighting effect
  switch (effectType) {
    case LightingEffectType.FLASH:
      lightElement.style.boxShadow = `0 0 30px ${color}`;
      lightElement.style.backgroundColor = `${color}33`; // 20% opacity
      
      gsap.to(lightElement, {
        opacity: 0,
        duration: options.duration,
        ease: 'power2.out',
        onComplete: () => {
          lightElement.remove();
        }
      });
      break;
      
    case LightingEffectType.PULSE:
      lightElement.style.boxShadow = `0 0 20px ${color}`;
      lightElement.style.backgroundColor = `${color}1a`; // 10% opacity
      
      gsap.to(lightElement, {
        boxShadow: `0 0 40px ${color}`,
        backgroundColor: `${color}33`, // 20% opacity
        duration: options.duration / 2,
        ease: 'power2.inOut',
        repeat: 1,
        yoyo: true,
        onComplete: () => {
          lightElement.remove();
        }
      });
      break;
      
    case LightingEffectType.GLOW:
      lightElement.style.boxShadow = `0 0 15px ${color}`;
      lightElement.style.backgroundColor = `${color}1a`; // 10% opacity
      
      gsap.to(lightElement, {
        boxShadow: `0 0 25px ${color}`,
        backgroundColor: `${color}26`, // 15% opacity
        duration: options.duration,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      });
      
      // Remove after 5 seconds
      setTimeout(() => {
        gsap.to(lightElement, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            lightElement.remove();
          }
        });
      }, 5000);
      break;
      
    default:
      lightElement.remove();
      return;
  }
  
  // Add to document
  document.body.appendChild(lightElement);
}

/**
 * Play sound effect
 */
function playSoundEffect(type: AnimationType, cardData?: CardData): void {
  if (!config.soundEnabled) return;
  
  // In a real implementation, this would play actual sounds
  if (config.debugMode) {
    console.log(`Playing sound effect for ${type}`, cardData);
  }
}

/**
 * Create a sequence of animations
 */
export function createAnimationSequence(
  animations: CardAnimationOptions[],
  options: TimelineOptions = {}
): {
  play: () => void;
  pause: () => void;
  resume: () => void;
} {
  if (!config.enabled || animations.length === 0) {
    return {
      play: () => {},
      pause: () => {},
      resume: () => {}
    };
  }
  
  const timeline = gsap.timeline({
    paused: true,
    ...options
  });
  
  // Add each animation to the timeline
  let position = 0;
  animations.forEach((animOptions, index) => {
    const { element, type } = animOptions;
    
    if (!element) {
      console.error(`Animation ${index} has no element`);
      return;
    }
    
    const duration = animOptions.duration || 0.5;
    const delay = animOptions.delay || 0;
    
    // Get animation
    const animation = getAnimationByType(type, element, animOptions);
    
    // Add to main timeline
    timeline.add(animation, position);
    
    // Update position for next animation
    position += duration + delay;
  });
  
  return {
    play: () => timeline.play(),
    pause: () => timeline.pause(),
    resume: () => timeline.resume()
  };
}

/**
 * Preload animation assets
 */
export function preloadAnimationAssets(): Promise<void> {
  return new Promise((resolve) => {
    // In a real implementation, this would preload images, sounds, etc.
    setTimeout(resolve, 100);
  });
}

/**
 * Clean up animation resources
 */
export function cleanupAnimations(): void {
  // In a real implementation, this would clean up any resources
  if (config.debugMode) {
    console.log('Cleaning up animation resources');
  }
}

export default {
  animateCard,
  createAnimationSequence,
  configureAnimations,
  getAnimationConfig,
  preloadAnimationAssets,
  cleanupAnimations,
  AnimationType,
  ParticleEffectType,
  LightingEffectType
};