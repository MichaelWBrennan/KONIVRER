/**
 * Card-Specific Animations
 * 
 * Provides specialized animations for specific cards in the KONIVRER game.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

// Types
interface AnimationSettings {
  duration: number;
  easing: string;
  intensity: number;
}

interface AnimationTimeline {
  to: (element: HTMLElement, properties: Record<string, any>) => AnimationTimeline;
  from: (element: HTMLElement, properties: Record<string, any>) => AnimationTimeline;
  set: (element: HTMLElement, properties: Record<string, any>) => AnimationTimeline;
  fromTo: (element: HTMLElement, from: Record<string, any>, to: Record<string, any>) => AnimationTimeline;
}

interface CardAnimation {
  onPlay?: (element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings) => void;
  onAttack?: (element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings) => void;
  onDefend?: (element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings) => void;
  onDestroy?: (element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings) => void;
  onHover?: (element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings) => void;
  onSelect?: (element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings) => void;
}

// Animation registry
const cardAnimations = new Map<string, CardAnimation>();

/**
 * Register a card-specific animation
 */
export const registerCardAnimation = (cardId: string, animation: CardAnimation): void => {
  cardAnimations.set(cardId, animation);
};

/**
 * Get animation for a specific card
 */
export const getCardAnimation = (cardId: string): CardAnimation | undefined => {
  return cardAnimations.get(cardId);
};

/**
 * Execute a specific animation for a card
 */
export const executeCardAnimation = (
  cardId: string,
  animationType: keyof CardAnimation,
  element: HTMLElement,
  timeline: AnimationTimeline,
  settings: AnimationSettings
): void => {
  const animation = cardAnimations.get(cardId);
  if (animation && animation[animationType]) {
    animation[animationType]!(element, timeline, settings);
  }
};

// ============================================================================
// CARD-SPECIFIC ANIMATIONS
// ============================================================================

// Fire Elemental - Example of a fire-based card
registerCardAnimation('fire-elemental', {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Add fire effect when played
    timeline
      .to(element, {
        duration: settings.duration * 0.3,
        scale: 1.1,
        rotation: 5,
        boxShadow: '0 0 20px rgba(255, 100, 0, 0.8)',
      })
      .to(element, {
        duration: settings.duration * 0.7,
        scale: 1,
        rotation: 0,
        boxShadow: '0 0 10px rgba(255, 100, 0, 0.4)',
      });
  },

  onAttack(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Fire attack animation
    timeline
      .to(element, {
        duration: settings.duration * 0.2,
        x: 20,
        scale: 1.05,
        filter: 'hue-rotate(30deg) brightness(1.2)',
      })
      .to(element, {
        duration: settings.duration * 0.3,
        x: -10,
        scale: 1.1,
        filter: 'hue-rotate(60deg) brightness(1.4)',
      })
      .to(element, {
        duration: settings.duration * 0.5,
        x: 0,
        scale: 1,
        filter: 'none',
      });
  },

  onHover(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Gentle fire glow on hover
    timeline.to(element, {
      duration: settings.duration * 0.5,
      boxShadow: '0 0 15px rgba(255, 100, 0, 0.6)',
      scale: 1.02,
    });
  },
});

// Water Elemental - Example of a water-based card
registerCardAnimation('water-elemental', {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Water ripple effect when played
    timeline
      .to(element, {
        duration: settings.duration * 0.4,
        scale: 1.05,
        filter: 'hue-rotate(180deg) brightness(1.1)',
        boxShadow: '0 0 20px rgba(0, 150, 255, 0.8)',
      })
      .to(element, {
        duration: settings.duration * 0.6,
        scale: 1,
        filter: 'none',
        boxShadow: '0 0 10px rgba(0, 150, 255, 0.4)',
      });
  },

  onAttack(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Water wave attack
    timeline
      .to(element, {
        duration: settings.duration * 0.3,
        y: -15,
        rotation: -10,
        filter: 'hue-rotate(200deg) brightness(1.3)',
      })
      .to(element, {
        duration: settings.duration * 0.4,
        y: 5,
        rotation: 5,
        filter: 'hue-rotate(220deg) brightness(1.1)',
      })
      .to(element, {
        duration: settings.duration * 0.3,
        y: 0,
        rotation: 0,
        filter: 'none',
      });
  },

  onHover(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Gentle water shimmer on hover
    timeline.to(element, {
      duration: settings.duration * 0.5,
      boxShadow: '0 0 15px rgba(0, 150, 255, 0.6)',
      filter: 'brightness(1.05)',
    });
  },
});

// Earth Elemental - Example of an earth-based card
registerCardAnimation('earth-elemental', {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Earthquake effect when played
    timeline
      .to(element, {
        duration: settings.duration * 0.2,
        y: -5,
        rotation: 2,
      })
      .to(element, {
        duration: settings.duration * 0.2,
        y: 5,
        rotation: -2,
      })
      .to(element, {
        duration: settings.duration * 0.2,
        y: -3,
        rotation: 1,
      })
      .to(element, {
        duration: settings.duration * 0.4,
        y: 0,
        rotation: 0,
        boxShadow: '0 0 15px rgba(139, 69, 19, 0.6)',
      });
  },

  onAttack(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Ground slam attack
    timeline
      .to(element, {
        duration: settings.duration * 0.3,
        scale: 1.1,
        y: -10,
      })
      .to(element, {
        duration: settings.duration * 0.2,
        scale: 1.15,
        y: 0,
        filter: 'sepia(0.3) brightness(1.2)',
      })
      .to(element, {
        duration: settings.duration * 0.5,
        scale: 1,
        filter: 'none',
      });
  },

  onDefend(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Stone barrier defense
    timeline
      .to(element, {
        duration: settings.duration * 0.3,
        scale: 0.95,
        filter: 'brightness(0.8) contrast(1.2)',
      })
      .to(element, {
        duration: settings.duration * 0.7,
        scale: 1,
        filter: 'none',
        boxShadow: '0 0 20px rgba(139, 69, 19, 0.8)',
      });
  },
});

// Air Elemental - Example of an air-based card
registerCardAnimation('air-elemental', {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Wind swirl effect when played
    timeline
      .to(element, {
        duration: settings.duration * 0.5,
        rotation: 360,
        scale: 1.05,
        filter: 'brightness(1.1)',
        boxShadow: '0 0 20px rgba(200, 200, 255, 0.8)',
      })
      .to(element, {
        duration: settings.duration * 0.5,
        rotation: 0,
        scale: 1,
        filter: 'none',
        boxShadow: '0 0 10px rgba(200, 200, 255, 0.4)',
      });
  },

  onAttack(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Wind gust attack
    timeline
      .to(element, {
        duration: settings.duration * 0.2,
        x: -20,
        rotation: -15,
        filter: 'blur(1px) brightness(1.2)',
      })
      .to(element, {
        duration: settings.duration * 0.3,
        x: 30,
        rotation: 15,
        filter: 'blur(2px) brightness(1.3)',
      })
      .to(element, {
        duration: settings.duration * 0.5,
        x: 0,
        rotation: 0,
        filter: 'none',
      });
  },

  onHover(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Gentle floating on hover
    timeline.to(element, {
      duration: settings.duration * 0.5,
      y: -5,
      boxShadow: '0 5px 15px rgba(200, 200, 255, 0.6)',
    });
  },
});

// Lightning Bolt - Example of a spell card
registerCardAnimation('lightning-bolt', {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Lightning flash effect
    timeline
      .to(element, {
        duration: settings.duration * 0.1,
        filter: 'brightness(2) contrast(2)',
        boxShadow: '0 0 30px rgba(255, 255, 0, 1)',
      })
      .to(element, {
        duration: settings.duration * 0.1,
        filter: 'brightness(0.5)',
        boxShadow: '0 0 5px rgba(255, 255, 0, 0.3)',
      })
      .to(element, {
        duration: settings.duration * 0.1,
        filter: 'brightness(1.5)',
        boxShadow: '0 0 20px rgba(255, 255, 0, 0.8)',
      })
      .to(element, {
        duration: settings.duration * 0.7,
        filter: 'none',
        boxShadow: 'none',
      });
  },

  onAttack(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Electric discharge
    timeline
      .to(element, {
        duration: settings.duration * 0.1,
        scale: 1.2,
        filter: 'brightness(2) hue-rotate(60deg)',
      })
      .to(element, {
        duration: settings.duration * 0.2,
        scale: 0.9,
        filter: 'brightness(0.7)',
      })
      .to(element, {
        duration: settings.duration * 0.7,
        scale: 1,
        filter: 'none',
      });
  },
});

// Healing Potion - Example of a healing item
registerCardAnimation('healing-potion', {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Healing glow effect
    timeline
      .to(element, {
        duration: settings.duration * 0.3,
        scale: 1.1,
        filter: 'hue-rotate(120deg) brightness(1.3)',
        boxShadow: '0 0 25px rgba(0, 255, 0, 0.8)',
      })
      .to(element, {
        duration: settings.duration * 0.7,
        scale: 1,
        filter: 'none',
        boxShadow: '0 0 10px rgba(0, 255, 0, 0.4)',
      });
  },

  onHover(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Gentle healing aura on hover
    timeline.to(element, {
      duration: settings.duration * 0.5,
      boxShadow: '0 0 15px rgba(0, 255, 0, 0.6)',
      filter: 'brightness(1.1)',
    });
  },
});

// Dragon - Example of a powerful creature
registerCardAnimation('dragon', {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Dramatic entrance
    timeline
      .from(element, {
        scale: 0.5,
        rotation: -180,
        opacity: 0,
      })
      .to(element, {
        duration: settings.duration * 0.5,
        scale: 1.2,
        rotation: 10,
        opacity: 1,
        boxShadow: '0 0 30px rgba(255, 0, 0, 0.8)',
      })
      .to(element, {
        duration: settings.duration * 0.5,
        scale: 1,
        rotation: 0,
        boxShadow: '0 0 15px rgba(255, 0, 0, 0.4)',
      });
  },

  onAttack(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Devastating attack
    timeline
      .to(element, {
        duration: settings.duration * 0.2,
        scale: 1.3,
        rotation: -10,
        filter: 'brightness(1.5) contrast(1.3)',
      })
      .to(element, {
        duration: settings.duration * 0.3,
        scale: 1.1,
        rotation: 5,
        filter: 'brightness(1.2)',
      })
      .to(element, {
        duration: settings.duration * 0.5,
        scale: 1,
        rotation: 0,
        filter: 'none',
      });
  },

  onDestroy(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    // Epic destruction
    timeline
      .to(element, {
        duration: settings.duration * 0.3,
        scale: 1.5,
        rotation: 180,
        filter: 'brightness(2) contrast(2)',
        opacity: 0.8,
      })
      .to(element, {
        duration: settings.duration * 0.7,
        scale: 0,
        rotation: 360,
        filter: 'brightness(0)',
        opacity: 0,
      });
  },
});

// Default animations for cards without specific animations
export const defaultCardAnimations: CardAnimation = {
  onPlay(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    timeline
      .to(element, {
        duration: settings.duration * 0.5,
        scale: 1.05,
        boxShadow: '0 0 10px rgba(100, 100, 100, 0.5)',
      })
      .to(element, {
        duration: settings.duration * 0.5,
        scale: 1,
        boxShadow: 'none',
      });
  },

  onHover(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    timeline.to(element, {
      duration: settings.duration * 0.3,
      scale: 1.02,
      y: -2,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    });
  },

  onSelect(element: HTMLElement, timeline: AnimationTimeline, settings: AnimationSettings): void {
    timeline.to(element, {
      duration: settings.duration * 0.3,
      scale: 1.05,
      boxShadow: '0 0 15px rgba(0, 100, 255, 0.6)',
    });
  },
};

/**
 * Apply default animation if no specific animation exists
 */
export const applyCardAnimation = (
  cardId: string,
  animationType: keyof CardAnimation,
  element: HTMLElement,
  timeline: AnimationTimeline,
  settings: AnimationSettings
): void => {
  const specificAnimation = cardAnimations.get(cardId);
  
  if (specificAnimation && specificAnimation[animationType]) {
    specificAnimation[animationType]!(element, timeline, settings);
  } else if (defaultCardAnimations[animationType]) {
    defaultCardAnimations[animationType]!(element, timeline, settings);
  }
};

export default {
  registerCardAnimation,
  getCardAnimation,
  executeCardAnimation,
  applyCardAnimation,
  defaultCardAnimations,
};