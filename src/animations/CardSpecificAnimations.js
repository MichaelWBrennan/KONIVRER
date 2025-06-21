/**
 * KONIVRER Card-Specific Animations
 * 
 * This module provides unique animations for specific cards based on their
 * abilities, lore, and visual identity. Each card can have custom animations
 * for different actions like playing, attacking, activating abilities, etc.
 */

import { gsap } from 'gsap';
import { createParticleSystem } from './ParticleSystem';

// Card animation registry
const cardAnimations = new Map();

/**
 * Get animations for a specific card
 * @param {string} cardId - Card ID
 * @param {string} cardType - Card type
 * @returns {Object|null} Card-specific animations or null if not found
 */
export function getCardSpecificAnimations(cardId, cardType) {
  // First try to find by exact card ID
  if (cardId && cardAnimations.has(cardId)) {
    return cardAnimations.get(cardId);
  }
  
  // Fall back to type-based animations
  if (cardType) {
    const typeKey = `type:${cardType.toLowerCase()}`;
    if (cardAnimations.has(typeKey)) {
      return cardAnimations.get(typeKey);
    }
  }
  
  return null;
}

/**
 * Register animations for a specific card
 * @param {string} cardId - Card ID or type key (e.g., "type:familiar")
 * @param {Object} animations - Animation handlers
 */
function registerCardAnimation(cardId, animations) {
  cardAnimations.set(cardId, animations);
}

// ============================================================================
// CARD-SPECIFIC ANIMATIONS
// ============================================================================

// Fire Elemental - Example of a fire-based card
registerCardAnimation('fire-elemental', {
  onPlay(element, timeline, settings) {
    // Add fire effect when played
    timeline.to(element, {
      duration: 0.3,
      filter: 'brightness(1.5) hue-rotate(10deg)',
      boxShadow: '0 0 20px rgba(255, 100, 0, 0.8)',
      ease: "power2.out"
    }).to(element, {
      duration: 0.5,
      filter: 'brightness(1.2) hue-rotate(0deg)',
      boxShadow: '0 0 10px rgba(255, 100, 0, 0.4)',
      ease: "power2.inOut"
    });
    
    // Add fire particles if high quality
    if (settings.particleCount > 20) {
      const elementRect = element.getBoundingClientRect();
      const particleContainer = document.createElement('div');
      particleContainer.style.position = 'absolute';
      particleContainer.style.top = `${elementRect.top}px`;
      particleContainer.style.left = `${elementRect.left}px`;
      particleContainer.style.width = `${elementRect.width}px`;
      particleContainer.style.height = `${elementRect.height}px`;
      particleContainer.style.pointerEvents = 'none';
      document.body.appendChild(particleContainer);
      
      createParticleSystem(particleContainer, {
        type: 'play',
        color: '#FF5500',
        count: settings.particleCount,
        duration: 1.5,
        gravity: -0.05
      });
      
      setTimeout(() => {
        if (particleContainer.parentNode) {
          particleContainer.parentNode.removeChild(particleContainer);
        }
      }, 1500);
    }
  },
  
  onAttack(element, targetElement, timeline, settings) {
    // Add fire trail during attack
    timeline.to(element, {
      duration: 0.2,
      filter: 'brightness(1.5) hue-rotate(10deg)',
      boxShadow: '0 0 20px rgba(255, 100, 0, 0.8)',
      ease: "power2.out"
    }, "-=0.4");
    
    // Add impact fire explosion
    timeline.to(targetElement, {
      duration: 0.1,
      filter: 'brightness(1.5) sepia(0.3)',
      ease: "power4.out"
    }, "-=0.1").to(targetElement, {
      duration: 0.3,
      filter: 'brightness(1) sepia(0)',
      ease: "power2.out"
    });
  },
  
  onAbility(element, timeline, settings, abilityIndex, targets) {
    // Fire ability effect
    timeline.to(element, {
      duration: 0.3,
      filter: 'brightness(1.5) hue-rotate(10deg)',
      boxShadow: '0 0 20px rgba(255, 100, 0, 0.8)',
      ease: "power2.out"
    }).to(element, {
      duration: 0.5,
      filter: 'brightness(1.2) hue-rotate(0deg)',
      boxShadow: '0 0 10px rgba(255, 100, 0, 0.4)',
      ease: "power2.inOut"
    });
    
    // Add fire particles for each target
    if (targets.length > 0 && settings.particleCount > 0) {
      targets.forEach((target, index) => {
        const targetElement = target.element;
        if (!targetElement) return;
        
        const delay = index * 0.1;
        
        timeline.to(targetElement, {
          duration: 0.2,
          filter: 'brightness(1.4) sepia(0.3)',
          ease: "power2.out",
          delay: delay + 0.4
        }).to(targetElement, {
          duration: 0.4,
          filter: 'brightness(1) sepia(0)',
          ease: "power2.inOut"
        });
      });
    }
  }
});

// Water Elemental - Example of a water-based card
registerCardAnimation('water-elemental', {
  onPlay(element, timeline, settings) {
    // Add water ripple effect when played
    timeline.to(element, {
      duration: 0.3,
      filter: 'brightness(1.3) hue-rotate(-10deg)',
      boxShadow: '0 0 20px rgba(0, 100, 255, 0.8)',
      ease: "power2.out"
    }).to(element, {
      duration: 0.5,
      filter: 'brightness(1.1) hue-rotate(0deg)',
      boxShadow: '0 0 10px rgba(0, 100, 255, 0.4)',
      ease: "power2.inOut"
    });
    
    // Add water particles if high quality
    if (settings.particleCount > 20) {
      const elementRect = element.getBoundingClientRect();
      const particleContainer = document.createElement('div');
      particleContainer.style.position = 'absolute';
      particleContainer.style.top = `${elementRect.top}px`;
      particleContainer.style.left = `${elementRect.left}px`;
      particleContainer.style.width = `${elementRect.width}px`;
      particleContainer.style.height = `${elementRect.height}px`;
      particleContainer.style.pointerEvents = 'none';
      document.body.appendChild(particleContainer);
      
      createParticleSystem(particleContainer, {
        type: 'play',
        color: '#00AAFF',
        count: settings.particleCount,
        duration: 1.5,
        gravity: 0.05
      });
      
      setTimeout(() => {
        if (particleContainer.parentNode) {
          particleContainer.parentNode.removeChild(particleContainer);
        }
      }, 1500);
    }
  },
  
  onAttack(element, targetElement, timeline, settings) {
    // Add water trail during attack
    timeline.to(element, {
      duration: 0.2,
      filter: 'brightness(1.3) hue-rotate(-10deg)',
      boxShadow: '0 0 20px rgba(0, 100, 255, 0.8)',
      ease: "power2.out"
    }, "-=0.4");
    
    // Add impact water splash
    timeline.to(targetElement, {
      duration: 0.1,
      filter: 'brightness(1.3) hue-rotate(-10deg)',
      ease: "power4.out"
    }, "-=0.1").to(targetElement, {
      duration: 0.3,
      filter: 'brightness(1) hue-rotate(0deg)',
      ease: "power2.out"
    });
  }
});

// Lightning Bolt - Example of a spell card
registerCardAnimation('lightning-bolt', {
  onPlay(element, timeline, settings) {
    // Lightning flash effect
    timeline.to(element, {
      duration: 0.1,
      filter: 'brightness(2) contrast(1.5)',
      ease: "power4.out"
    }).to(element, {
      duration: 0.2,
      filter: 'brightness(1.2) contrast(1.1)',
      ease: "power2.inOut"
    });
    
    // Create lightning particles
    if (settings.particleCount > 0) {
      const elementRect = element.getBoundingClientRect();
      const particleContainer = document.createElement('div');
      particleContainer.style.position = 'absolute';
      particleContainer.style.top = `${elementRect.top}px`;
      particleContainer.style.left = `${elementRect.left}px`;
      particleContainer.style.width = `${elementRect.width}px`;
      particleContainer.style.height = `${elementRect.height}px`;
      particleContainer.style.pointerEvents = 'none';
      document.body.appendChild(particleContainer);
      
      createParticleSystem(particleContainer, {
        type: 'play',
        color: '#FFFF00',
        count: settings.particleCount,
        duration: 1,
        gravity: -0.02,
        speed: 1.5
      });
      
      setTimeout(() => {
        if (particleContainer.parentNode) {
          particleContainer.parentNode.removeChild(particleContainer);
        }
      }, 1000);
    }
  }
});

// Dragon - Example of a legendary creature
registerCardAnimation('dragon', {
  onPlay(element, timeline, settings) {
    // Dragon entrance effect
    timeline.to(element, {
      duration: 0.3,
      scale: 1.2,
      filter: 'brightness(1.4) saturate(1.3)',
      boxShadow: '0 0 30px rgba(255, 50, 0, 0.8)',
      ease: "power3.out"
    }).to(element, {
      duration: 0.5,
      scale: 1,
      filter: 'brightness(1.1) saturate(1.1)',
      boxShadow: '0 0 15px rgba(255, 50, 0, 0.4)',
      ease: "elastic.out(1, 0.3)"
    });
    
    // Create fire breath particles
    if (settings.particleCount > 0) {
      const elementRect = element.getBoundingClientRect();
      const particleContainer = document.createElement('div');
      particleContainer.style.position = 'absolute';
      particleContainer.style.top = `${elementRect.top}px`;
      particleContainer.style.left = `${elementRect.left}px`;
      particleContainer.style.width = `${elementRect.width}px`;
      particleContainer.style.height = `${elementRect.height}px`;
      particleContainer.style.pointerEvents = 'none';
      document.body.appendChild(particleContainer);
      
      createParticleSystem(particleContainer, {
        type: 'play',
        color: '#FF3300',
        count: settings.particleCount * 1.5,
        duration: 2,
        gravity: -0.05,
        speed: 1.2
      });
      
      setTimeout(() => {
        if (particleContainer.parentNode) {
          particleContainer.parentNode.removeChild(particleContainer);
        }
      }, 2000);
    }
  },
  
  onAttack(element, targetElement, timeline, settings) {
    // Dragon attack effect
    timeline.to(element, {
      duration: 0.2,
      scale: 1.1,
      filter: 'brightness(1.3) saturate(1.2)',
      boxShadow: '0 0 20px rgba(255, 50, 0, 0.7)',
      ease: "power2.out"
    }, "-=0.4").to(element, {
      duration: 0.3,
      scale: 1,
      filter: 'brightness(1.1) saturate(1.1)',
      boxShadow: '0 0 10px rgba(255, 50, 0, 0.4)',
      ease: "power2.inOut"
    });
    
    // Add impact fire explosion
    timeline.to(targetElement, {
      duration: 0.15,
      scale: 0.9,
      filter: 'brightness(1.5) sepia(0.4)',
      ease: "power4.out"
    }, "-=0.1").to(targetElement, {
      duration: 0.4,
      scale: 1,
      filter: 'brightness(1) sepia(0)',
      ease: "elastic.out(1, 0.3)"
    });
  }
});

// ============================================================================
// TYPE-BASED ANIMATIONS
// ============================================================================

// Generic Familiar animations
registerCardAnimation('type:familiar', {
  onPlay(element, timeline, settings) {
    // Generic familiar entrance
    timeline.to(element, {
      duration: 0.3,
      scale: 1.1,
      filter: 'brightness(1.2)',
      ease: "power2.out"
    }).to(element, {
      duration: 0.4,
      scale: 1,
      filter: 'brightness(1)',
      ease: "elastic.out(1, 0.3)"
    });
  },
  
  onAttack(element, targetElement, timeline, settings) {
    // Generic attack animation
    timeline.to(element, {
      duration: 0.15,
      scale: 1.05,
      filter: 'brightness(1.1)',
      ease: "power2.out"
    }, "-=0.3").to(element, {
      duration: 0.25,
      scale: 1,
      filter: 'brightness(1)',
      ease: "power2.inOut"
    });
  }
});

// Generic Spell animations
registerCardAnimation('type:spell', {
  onPlay(element, timeline, settings) {
    // Generic spell cast
    timeline.to(element, {
      duration: 0.25,
      scale: 1.1,
      filter: 'brightness(1.3) saturate(1.2)',
      ease: "power2.out"
    }).to(element, {
      duration: 0.4,
      scale: 0,
      opacity: 0,
      filter: 'brightness(1.5) saturate(1.5)',
      ease: "power3.in"
    });
  }
});

// Generic Azoth animations
registerCardAnimation('type:azoth', {
  onPlay(element, timeline, settings) {
    // Generic azoth placement
    timeline.to(element, {
      duration: 0.3,
      scale: 1.1,
      filter: 'brightness(1.2) saturate(1.1)',
      ease: "power2.out"
    }).to(element, {
      duration: 0.4,
      scale: 1,
      filter: 'brightness(1) saturate(1)',
      ease: "elastic.out(1, 0.3)"
    });
    
    // Add subtle glow effect
    timeline.to(element, {
      duration: 0.5,
      boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
      ease: "power2.inOut"
    }, "-=0.4").to(element, {
      duration: 0.5,
      boxShadow: '0 0 5px rgba(255, 215, 0, 0.2)',
      ease: "power2.inOut"
    });
  }
});

export default {
  getCardSpecificAnimations,
  registerCardAnimation
};