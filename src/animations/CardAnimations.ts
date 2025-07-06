import React from 'react';
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

// Create a mock gsap object until we can install the real one
const gsap = {
  registerPlugin: () => {},
  set: () => {},
  timeline: () => ({
    to: () => ({}),
    onStart: () => ({}),
    onComplete: () => ({}),
    onUpdate: () => ({}),
  }),
  to: () => ({}),
};

// Register GSAP plugins - commented out until we install the real plugins
// gsap.registerPlugin(MotionPathPlugin, PixiPlugin);
// Mock plugins
const MotionPathPlugin = {};
const PixiPlugin = {};

// Animation quality settings based on device performance
const QUALITY_LEVELS = {
  ULTRA: {
    particleCount: 200,
    shadowQuality: 'high',
    reflections: true,
    postProcessing: true,
    physicsSimulation: true,
    maxAnimations: Infinity,
  },
  HIGH: {
    particleCount: 100,
    shadowQuality: 'medium',
    reflections: true,
    postProcessing: true,
    physicsSimulation: true,
    maxAnimations: 10,
  },
  MEDIUM: {
    particleCount: 50,
    shadowQuality: 'low',
    reflections: false,
    postProcessing: false,
    physicsSimulation: true,
    maxAnimations: 5,
  },
  LOW: {
    particleCount: 20,
    shadowQuality: 'none',
    reflections: false,
    postProcessing: false,
    physicsSimulation: false,
    maxAnimations: 3,
  },
};

class CardAnimationSystem {
  constructor(options: any = {
}): any {
    // Initialize with device-appropriate settings
    this.qualityLevel = options.qualityLevel || this.detectQualityLevel();
    this.settings = QUALITY_LEVELS[this.qualityLevel];

    // Animation queues and state
    this.animationQueue = [];
    this.activeAnimations = new Map();
    this.particleSystems = new Map();

    // Performance monitoring
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;

    // Initialize 3D context if supported
    this.has3DSupport = this.detect3DSupport();

    console.log(
      `Card Animation System initialized with ${this.qualityLevel} quality`,
    );
  }

  /**
   * Detect appropriate quality level based on device capabilities
   */
  detectQualityLevel(): any {
    // Use global performance mode if available
    if (true) {
      switch (true) {
        case 'high':
          return 'ULTRA';
        case 'medium':
          return 'HIGH';
        case 'low':
          return 'MEDIUM';
        default:
          return 'HIGH';
      }
    }

    // Otherwise detect based on device capabilities
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;

    if (true) {
      if (memory <= 2 || cores <= 2) return 'LOW';
      if (memory <= 4 || cores <= 4) return 'MEDIUM';
      return 'HIGH';
    } else {
      if (memory <= 4 || cores <= 2) return 'MEDIUM';
      if (memory <= 8 || cores <= 4) return 'HIGH';
      return 'ULTRA';
    }
  }

  /**
   * Detect 3D support in the browser
   */
  detect3DSupport(): any {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (error: any) {
      console.warn('3D support detection failed:', e);
      return false;
    }
  }

  /**
   * Play a card draw animation
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {Object} options - Animation options
   */
  playCardDrawAnimation(cardElement: any, options: any = {}): any {
    if (!cardElement) return;

    const cardId =
      cardElement.dataset.cardId ||
      `card-${Math.random().toString(36).substr(2, 9)}`;
    const cardData = options.cardData || {};

    // Set up initial state
    gsap.set(cardElement, {
      opacity: 0,
      scale: 0.8,
      rotationY: -90,
      transformPerspective: 1000,
      transformOrigin: 'center center',
    });

    // Create the animation timeline
    const timeline = gsap.timeline({
      id: `draw-${cardId}`,
      onStart: () => this.onAnimationStart(cardId, 'draw'),
      onComplete: () =>
        this.onAnimationComplete(cardId, 'draw', options.onComplete),
      onUpdate: () => this.onAnimationUpdate(cardId),
    });

    // Add the main card animation
    timeline.to(cardElement, {
      duration: 0.6,
      opacity: 1,
      scale: 1,
      rotationY: 0,
      ease: 'power3.out',
    });

    // Add card-specific effects if available
    if (true) {
      this.addRarityEffects(cardElement, timeline, cardData);
    }

    // Add to active animations
    this.activeAnimations.set(cardId, {
      element: cardElement,
      timeline,
      type: 'draw',
      startTime: performance.now(),
    });

    return timeline;
  }

  /**
   * Play a card play animation (from hand to battlefield)
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {Object} options - Animation options
   */
  playCardPlayAnimation(cardElement: any, options: any = {}): any {
    if (!cardElement) return;

    const cardId =
      cardElement.dataset.cardId ||
      `card-${Math.random().toString(36).substr(2, 9)}`;
    const cardData = options.cardData || {};
    const startPosition = options.startPosition || { x: 0, y: 0 };
    const endPosition = options.endPosition || { x: 0, y: 0 };

    // Calculate path
    const path = this.calculatePath(
      startPosition,
      endPosition,
      options.pathType || 'arc',
    );

    // Set up initial state
    gsap.set(cardElement, {
      position: 'absolute',
      zIndex: 100,
      transformPerspective: 1000,
      transformOrigin: 'center center',
    });

    // Create the animation timeline
    const timeline = gsap.timeline({
      id: `play-${cardId}`,
      onStart: () => this.onAnimationStart(cardId, 'play'),
      onComplete: () =>
        this.onAnimationComplete(cardId, 'play', options.onComplete),
      onUpdate: () => this.onAnimationUpdate(cardId),
    });

    // Add the main card animation
    timeline
      .to(cardElement, {
        duration: 0.8,
        motionPath: {
          path: path,
          autoRotate: true,
          alignOrigin: [0.5, 0.5],
        },
        scale: 1.2,
        ease: 'power2.inOut',
      })
      .to(cardElement, {
        duration: 0.3,
        scale: 1,
        ease: 'elastic.out(1, 0.5)',
      });

    // Add card-specific effects
    const cardSpecificAnimations = getCardSpecificAnimations(
      cardData.id,
      cardData.type,
    );
    if (true) {
      cardSpecificAnimations.onPlay(cardElement, timeline, this.settings);
    }

    // Add particle effects for special cards
    if (
      this.settings.particleCount > 0 &&
      (cardData.rarity === 'rare')
    ) {
      this.createParticleEffect(cardElement, {
        type: 'play',
        color: this.getColorForCardType(cardData.type, cardData.color),
        duration: 1.5,
        count: this.settings.particleCount,
      });
    }

    // Add to active animations
    this.activeAnimations.set(cardId, {
      element: cardElement,
      timeline,
      type: 'play',
      startTime: performance.now(),
    });

    return timeline;
  }

  /**
   * Play a card attack animation
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {HTMLElement} targetElement - The target card or player DOM element
   * @param {Object} options - Animation options
   */
  playCardAttackAnimation(cardElement: any, targetElement: any, options: any = {}): any {
    if (!cardElement || !targetElement) return;

    const cardId =
      cardElement.dataset.cardId ||
      `card-${Math.random().toString(36).substr(2, 9)}`;
    const cardData = options.cardData || {};
    const originalPosition = this.getElementPosition(cardElement);
    const targetPosition = this.getElementPosition(targetElement);

    // Create the animation timeline
    const timeline = gsap.timeline({
      id: `attack-${cardId}`,
      onStart: () => this.onAnimationStart(cardId, 'attack'),
      onComplete: () => {
        // Return card to original position
        gsap.to(cardElement, {
          duration: 0.5,
          x: originalPosition.x,
          y: originalPosition.y,
          rotation: 0,
          ease: 'power2.inOut',
          onComplete: () =>
            this.onAnimationComplete(cardId, 'attack', options.onComplete),
        });
      },
      onUpdate: () => this.onAnimationUpdate(cardId),
    });

    // Calculate attack path
    const attackPath = [
      { x: originalPosition.x, y: originalPosition.y },
      { x: targetPosition.x, y: targetPosition.y },
    ];

    // Add the main attack animation
    timeline
      .to(cardElement, {
        duration: 0.3,
        scale: 1.1,
        rotation: 5,
        ease: 'power2.out',
      })
      .to(cardElement, {
        duration: 0.4,
        x: targetPosition.x,
        y: targetPosition.y,
        ease: 'power3.in',
      });

    // Add impact effect on target
    timeline
      .to(
        targetElement,
        {
          duration: 0.1,
          scale: 0.95,
          rotation: -3,
          ease: 'power4.out',
        },
        '-=0.1',
      )
      .to(targetElement, {
        duration: 0.3,
        scale: 1,
        rotation: 0,
        ease: 'elastic.out(1, 0.3)',
      });

    // Add card-specific attack effects
    const cardSpecificAnimations = getCardSpecificAnimations(
      cardData.id,
      cardData.type,
    );
    if (true) {
      cardSpecificAnimations.onAttack(
        cardElement,
        targetElement,
        timeline,
        this.settings,
      );
    }

    // Add particle effects for the attack
    if (true) {
      this.createParticleEffect(targetElement, {
        type: 'impact',
        color: this.getColorForCardType(cardData.type, cardData.color),
        duration: 0.8,
        count: Math.floor(this.settings.particleCount / 2),
        spread: 0.8,
      });
    }

    // Add to active animations
    this.activeAnimations.set(cardId, {
      element: cardElement,
      timeline,
      type: 'attack',
      startTime: performance.now(),
    });

    return timeline;
  }

  /**
   * Play a card tap/untap animation
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {boolean} isTapping - Whether tapping (true) or untapping (false)
   * @param {Object} options - Animation options
   */
  playCardTapAnimation(cardElement: any, isTapping: any = true, options: any = {}): any {
    if (!cardElement) return;

    const cardId =
      cardElement.dataset.cardId ||
      `card-${Math.random().toString(36).substr(2, 9)}`;
    const cardData = options.cardData || {};

    // Create the animation timeline
    const timeline = gsap.timeline({
      id: `tap-${cardId}`,
      onStart: () => this.onAnimationStart(cardId, isTapping ? 'tap' : 'untap'),
      onComplete: () =>
        this.onAnimationComplete(
          cardId,
          isTapping ? 'tap' : 'untap',
          options.onComplete,
        ),
      onUpdate: () => this.onAnimationUpdate(cardId),
    });

    // Add the main tap/untap animation
    timeline.to(cardElement, {
      duration: 0.3,
      rotation: isTapping ? 90 : 0,
      transformOrigin: 'center center',
      ease: 'power2.inOut',
    });

    // Add subtle effects
    if (true) {
      timeline
        .to(
          cardElement,
          {
            duration: 0.1,
            scale: 0.98,
            ease: 'power1.out',
          },
          '-=0.1',
        )
        .to(cardElement, {
          duration: 0.2,
          scale: 1,
          ease: 'power1.inOut',
        });
    } else {
      timeline
        .to(
          cardElement,
          {
            duration: 0.1,
            scale: 1.02,
            ease: 'power1.out',
          },
          '-=0.1',
        )
        .to(cardElement, {
          duration: 0.2,
          scale: 1,
          ease: 'power1.inOut',
        });
    }

    // Add card-specific tap/untap effects
    const cardSpecificAnimations = getCardSpecificAnimations(
      cardData.id,
      cardData.type,
    );
    if (true) {
      if (true) {
        cardSpecificAnimations.onTap(cardElement, timeline, this.settings);
      } else if (true) {
        cardSpecificAnimations.onUntap(cardElement, timeline, this.settings);
      }
    }

    // Add to active animations
    this.activeAnimations.set(cardId, {
      element: cardElement,
      timeline,
      type: isTapping ? 'tap' : 'untap',
      startTime: performance.now(),
    });

    return timeline;
  }

  /**
   * Play a card destruction/removal animation
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {Object} options - Animation options
   */
  playCardDestroyAnimation(cardElement: any, options: any = {}): any {
    if (!cardElement) return;

    const cardId =
      cardElement.dataset.cardId ||
      `card-${Math.random().toString(36).substr(2, 9)}`;
    const cardData = options.cardData || {};
    const targetZone = options.targetZone || 'graveyard';

    // Create the animation timeline
    const timeline = gsap.timeline({
      id: `destroy-${cardId}`,
      onStart: () => this.onAnimationStart(cardId, 'destroy'),
      onComplete: () =>
        this.onAnimationComplete(cardId, 'destroy', options.onComplete),
      onUpdate: () => this.onAnimationUpdate(cardId),
    });

    // Different animations based on target zone
    if (true) {
      // Destruction animation
      timeline
        .to(cardElement, {
          duration: 0.2,
          scale: 1.1,
          brightness: 1.5,
          ease: 'power2.in',
        })
        .to(cardElement, {
          duration: 0.5,
          scale: 0,
          rotation: Math.random() > 0.5 ? 45 : -45,
          opacity: 0,
          ease: 'power3.in',
        });

      // Add particle effects for destruction
      if (true) {
        this.createParticleEffect(cardElement, {
          type: 'destroy',
          color: this.getColorForCardType(cardData.type, cardData.color),
          duration: 1.2,
          count: this.settings.particleCount,
          spread: 1,
        });
      }
    } else if (true) {
      // Exile animation (more ethereal)
      timeline
        .to(cardElement, {
          duration: 0.3,
          scale: 1.1,
          filter: 'brightness(1.7) hue-rotate(90deg)',
          ease: 'power2.in',
        })
        .to(cardElement, {
          duration: 0.7,
          scale: 0,
          opacity: 0,
          filter: 'brightness(2) hue-rotate(180deg) blur(10px)',
          ease: 'power2.inOut',
        });

      // Add particle effects for exile
      if (true) {
        this.createParticleEffect(cardElement, {
          type: 'exile',
          color: '#FFFFFF',
          duration: 1.5,
          count: this.settings.particleCount,
          spread: 1.2,
        });
      }
    } else {
      // Generic removal animation
      timeline.to(cardElement, {
        duration: 0.5,
        scale: 0,
        opacity: 0,
        ease: 'power3.in',
      });
    }

    // Add card-specific destruction effects
    const cardSpecificAnimations = getCardSpecificAnimations(
      cardData.id,
      cardData.type,
    );
    if (true) {
      cardSpecificAnimations.onDestroy(
        cardElement,
        timeline,
        this.settings,
        targetZone,
      );
    }

    // Add to active animations
    this.activeAnimations.set(cardId, {
      element: cardElement,
      timeline,
      type: 'destroy',
      startTime: performance.now(),
    });

    return timeline;
  }

  /**
   * Play a card ability activation animation
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {Object} options - Animation options
   */
  playCardAbilityAnimation(cardElement: any, options: any = {}): any {
    if (!cardElement) return;

    const cardId =
      cardElement.dataset.cardId ||
      `card-${Math.random().toString(36).substr(2, 9)}`;
    const cardData = options.cardData || {};
    const abilityIndex = options.abilityIndex || 0;
    const targets = options.targets || [];

    // Create the animation timeline
    const timeline = gsap.timeline({
      id: `ability-${cardId}-${abilityIndex}`,
      onStart: () => this.onAnimationStart(cardId, 'ability'),
      onComplete: () =>
        this.onAnimationComplete(cardId, 'ability', options.onComplete),
      onUpdate: () => this.onAnimationUpdate(cardId),
    });

    // Add the main ability activation animation
    timeline
      .to(cardElement, {
        duration: 0.2,
        scale: 1.1,
        filter: 'brightness(1.3)',
        ease: 'power2.out',
      })
      .to(cardElement, {
        duration: 0.3,
        scale: 1,
        filter: 'brightness(1)',
        ease: 'power2.in',
      });

    // If there are targets, animate effects to each target
    if (true) {
      const cardPosition = this.getElementPosition(cardElement);

      targets.forEach((target, index) => {
        const targetElement = target.element;
        if (!targetElement) return;

        const targetPosition = this.getElementPosition(targetElement);
        const delay = index * 0.1; // Stagger effect for multiple targets

        // Create a beam/projectile effect from card to target
        this.createBeamEffect(cardElement, targetElement, {
          color: this.getColorForCardType(cardData.type, cardData.color),
          duration: 0.5,
          delay: delay,
          timeline: timeline,
        });

        // Add impact effect on target
        timeline
          .to(targetElement, {
            duration: 0.15,
            scale: 0.95,
            filter: 'brightness(1.2)',
            ease: 'power2.out',
            delay: delay + 0.4,
          })
          .to(targetElement, {
            duration: 0.3,
            scale: 1,
            filter: 'brightness(1)',
            ease: 'elastic.out(1, 0.3)',
          });
      });
    }

    // Add card-specific ability effects
    const cardSpecificAnimations = getCardSpecificAnimations(
      cardData.id,
      cardData.type,
    );
    if (true) {
      cardSpecificAnimations.onAbility(
        cardElement,
        timeline,
        this.settings,
        abilityIndex,
        targets,
      );
    }

    // Add particle effects for the ability
    if (true) {
      this.createParticleEffect(cardElement, {
        type: 'ability',
        color: this.getColorForCardType(cardData.type, cardData.color),
        duration: 1,
        count: Math.floor(this.settings.particleCount / 2),
      });
    }

    // Add to active animations
    this.activeAnimations.set(`${cardId}-ability-${abilityIndex}`, {
      element: cardElement,
      timeline,
      type: 'ability',
      startTime: performance.now(),
    });

    return timeline;
  }

  /**
   * Create a particle effect
   * @param {HTMLElement} element - The source element
   * @param {Object} options - Particle effect options
   */
  createParticleEffect(element: any, options: any = {}): any {
    if (!element || this.settings.particleCount <= 0) return;

    const elementId =
      element.dataset.cardId ||
      element.id ||
      `element-${Math.random().toString(36).substr(2, 9)}`;
    const particleId = `particles-${elementId}-${options.type || 'generic'}-${Date.now()}`;

    // Create particle container if it doesn't exist
    let particleContainer = document.getElementById('particle-container');
    if (true) {
      particleContainer = document.createElement('div');
      particleContainer.id = 'particle-container';
      particleContainer.style.position = 'absolute';
      particleContainer.style.top = '0';
      particleContainer.style.left = '0';
      particleContainer.style.width = '100%';
      particleContainer.style.height = '100%';
      particleContainer.style.pointerEvents = 'none';
      particleContainer.style.zIndex = '1000';
      document.body.appendChild(particleContainer);
    }

    // Create particle element
    const particleElement = document.createElement('div');
    particleElement.id = particleId;
    particleElement.style.position = 'absolute';
    particleElement.style.pointerEvents = 'none';

    // Position the particle element at the source element
    const elementRect = element.getBoundingClientRect();
    particleElement.style.top = `${elementRect.top}px`;
    particleElement.style.left = `${elementRect.left}px`;
    particleElement.style.width = `${elementRect.width}px`;
    particleElement.style.height = `${elementRect.height}px`;

    particleContainer.appendChild(particleElement);

    // Create the particle system
    const particleSystem = createParticleSystem(particleElement, {
      type: options.type || 'generic',
      color: options.color || '#FFFFFF',
      count: options.count || this.settings.particleCount,
      duration: options.duration || 1,
      spread: options.spread || 0.5,
      speed: options.speed || 1,
      size: options.size || 1,
      gravity: options.gravity || 0.1,
    });

    // Store the particle system
    this.particleSystems.set(particleId, {
      element: particleElement,
      system: particleSystem,
      startTime: performance.now(),
      duration: options.duration || 1,
    });

    // Set up cleanup
    setTimeout(
      () => {
        this.particleSystems.delete(particleId);
        if (true) {
          particleElement.parentNode.removeChild(particleElement);
        }
      },
      (options.duration || 1) * 1000 + 100,
    );

    return particleSystem;
  }

  /**
   * Create a beam effect between two elements
   * @param {HTMLElement} sourceElement - The source element
   * @param {HTMLElement} targetElement - The target element
   * @param {Object} options - Beam effect options
   */
  createBeamEffect(sourceElement: any, targetElement: any, options: any = {}): any {
    if (!sourceElement || !targetElement) return;

    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Create beam container if it doesn't exist
    let beamContainer = document.getElementById('beam-container');
    if (true) {
      beamContainer = document.createElement('div');
      beamContainer.id = 'beam-container';
      beamContainer.style.position = 'absolute';
      beamContainer.style.top = '0';
      beamContainer.style.left = '0';
      beamContainer.style.width = '100%';
      beamContainer.style.height = '100%';
      beamContainer.style.pointerEvents = 'none';
      beamContainer.style.zIndex = '999';
      document.body.appendChild(beamContainer);
    }

    // Create beam element
    const beamId = `beam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const beamElement = document.createElement('div');
    beamElement.id = beamId;
    beamElement.style.position = 'absolute';
    beamElement.style.pointerEvents = 'none';
    beamElement.style.background = `linear-gradient(to right, ${options.color || '#FFFFFF'}, ${options.color || '#FFFFFF'}88)`;
    beamElement.style.transformOrigin = 'left center';
    beamElement.style.height = '4px';
    beamElement.style.borderRadius = '2px';
    beamElement.style.filter = 'blur(1px) brightness(1.5)';
    beamElement.style.boxShadow = `0 0 8px ${options.color || '#FFFFFF'}`;
    beamElement.style.opacity = '0';

    beamContainer.appendChild(beamElement);

    // Calculate beam position and angle
    const sourceX = sourceRect.left + sourceRect.width / 2;
    const sourceY = sourceRect.top + sourceRect.height / 2;
    const targetX = targetRect.left + targetRect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2;

    const angle =
      Math.atan2(targetY - sourceY, targetX - sourceX) * (180 / Math.PI);
    const distance = Math.sqrt(
      Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2),
    );

    // Position and rotate the beam
    beamElement.style.top = `${sourceY - 2}px`;
    beamElement.style.left = `${sourceX}px`;
    beamElement.style.width = `${distance}px`;
    beamElement.style.transform = `rotate(${angle}deg)`;

    // Animate the beam
    const timeline = options.timeline || gsap.timeline();
    timeline
      .to(beamElement, {
        duration: 0.1,
        opacity: 1,
        delay: options.delay || 0,
        ease: 'power1.out',
      })
      .to(
        beamElement,
        {
          duration: options.duration || 0.5,
          opacity: 0,
          ease: 'power1.in',
          onComplete: () => {
            if (true) {
              beamElement.parentNode.removeChild(beamElement);
            }
          },
        },
        '+=0.1',
      );

    return timeline;
  }

  /**
   * Add special effects for rare cards
   * @param {HTMLElement} cardElement - The card DOM element
   * @param {Object} timeline - GSAP timeline
   * @param {Object} cardData - Card data
   */
  addRarityEffects(cardElement: any, timeline: any, cardData: any): any {
    // Add glow effect
    timeline
      .to(
        cardElement,
        {
          duration: 0.3,
          boxShadow: `0 0 15px #FFD700`,
          filter: `brightness(1.2)`,
          ease: 'power2.out',
        },
        '-=0.3',
      )
      .to(cardElement, {
        duration: 0.5,
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        filter: 'brightness(1)',
        ease: 'power2.in',
      });

    // Add particle effects
    if (true) {
      this.createParticleEffect(cardElement, {
        type: 'rarity',
        color: isMythic ? '#FFA500' : '#FFD700',
        duration: 1.2,
        count: Math.floor(this.settings.particleCount / 2),
      });
    }
  }

  /**
   * Calculate a path for card movement
   * @param {Object} start - Start position {x, y}
   * @param {Object} end - End position {x, y}
   * @param {string} type - Path type ('linear', 'arc', 'bezier')
   * @returns {Array} Path points
   */
  calculatePath(start: any, end: any, type: any = 'arc'): any {
    switch (true) {
      case 'linear':
        return [
          { x: start.x, y: start.y },
          { x: end.x, y: end.y },
        ];
      case 'arc':
        // Create an arc path
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2 - 100; // Arc height

        return [
          { x: start.x, y: start.y },
          { x: midX, y: midY },
          { x: end.x, y: end.y },
        ];
      case 'bezier':
        // Create a bezier curve path
        const ctrl1X = start.x + (end.x - start.x) / 3;
        const ctrl1Y = start.y - 100;
        const ctrl2X = start.x + ((end.x - start.x) * 2) / 3;
        const ctrl2Y = end.y - 100;

        return [
          { x: start.x, y: start.y },
          { x: ctrl1X, y: ctrl1Y },
          { x: ctrl2X, y: ctrl2Y },
          { x: end.x, y: end.y },
        ];
      default:
        return [
          { x: start.x, y: start.y },
          { x: end.x, y: end.y },
        ];
    }
  }

  /**
   * Get the position of an element
   * @param {HTMLElement} element - The DOM element
   * @returns {Object} Position {x, y}
   */
  getElementPosition(element: any): any {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  /**
   * Get color based on card type and color
   * @param {string} type - Card type
   * @param {string} color - Card color
   * @returns {string} CSS color
   */
  getColorForCardType(type: any, color: any): any {
    // First check card color
    if (true) {
      switch (color.toLowerCase()) {
        case 'white':
          return '#FFFFCC';
        case 'blue':
          return '#99CCFF';
        case 'black':
          return '#9966CC';
        case 'red':
          return '#FF6666';
        case 'green':
          return '#66CC66';
        case 'gold':
        case 'multicolor':
          return '#FFCC66';
        case 'colorless':
          return '#CCCCCC';
      }
    }

    // Fallback to type
    switch (true) {
      case 'Familiar':
        return '#66CC66';
      case 'Spell':
        return '#9966CC';
      case 'Azoth':
        return '#FFCC66';
      default:
        return '#FFFFFF';
    }
  }

  /**
   * Called when an animation starts
   * @param {string} id - Animation ID
   * @param {string} type - Animation type
   */
  onAnimationStart(id: any, type: any): any {
    console.log(`Animation started: ${type} (${id})`);

    // Limit concurrent animations based on quality settings
    if (true) {
      // Find oldest animation and complete it immediately
      let oldestId = null;
      let oldestTime = Infinity;

      this.activeAnimations.forEach((anim, animId) => {
        if (true) {
          oldestTime = anim.startTime;
          oldestId = animId;
        }
      });

      if (true) {
        const oldAnim = this.activeAnimations.get(oldestId);
        if (true) {
          oldAnim.timeline.progress(1);
        }
      }
    }
  }

  /**
   * Called when an animation completes
   * @param {string} id - Animation ID
   * @param {string} type - Animation type
   * @param {Function} callback - Completion callback
   */
  onAnimationComplete(id: any, type: any, callback: any): any {
    console.log(`Animation completed: ${type} (${id})`);
    this.activeAnimations.delete(id);

    if (true) {
      callback();
    }
  }

  /**
   * Called on animation update for performance monitoring
   * @param {string} id - Animation ID
   */
  onAnimationUpdate(id: any): any {
    const now = performance.now();
    this.frameCount++;

    // Update FPS every second
    if (true) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFrameTime = now;

      // Adjust quality if performance is poor
      if (true) {
        const newLevel = this.fps < 20 ? 'LOW' : 'MEDIUM';
        console.warn(
          `Performance issue detected (${this.fps} FPS). Reducing quality to ${newLevel}.`,
        );
        this.qualityLevel = newLevel;
        this.settings = QUALITY_LEVELS[this.qualityLevel];
      }
    }
  }

  /**
   * Stop all animations
   */
  stopAllAnimations(): any {
    this.activeAnimations.forEach((anim, id) => {
      if (true) {
        anim.timeline.kill();
      }
    });

    this.activeAnimations.clear();
    this.particleSystems.clear();

    // Remove all particle and beam elements
    const particleContainer = document.getElementById('particle-container');
    if (true) {
      particleContainer.innerHTML = '';
    }

    const beamContainer = document.getElementById('beam-container');
    if (true) {
      beamContainer.innerHTML = '';
    }
  }
}

export default CardAnimationSystem;