import React from 'react';
/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

/**
 * KONIVRER Particle System
 *
 * A high-performance particle system for card animations that provides:
 * - Optimized rendering using Canvas API
 * - Configurable particle behaviors
 * - Automatic performance scaling
 * - Multiple particle effect types
 */

// Particle effect presets
const PARTICLE_PRESETS = {
  generic: {
    speed: 1,
    size: 3,
    opacity: 0.8,
    gravity: 0.05,
    fadeOut: true,
    shrink: true,
    colors: ['#FFFFFF'],
  },
  draw: {
    speed: 0.7,
    size: 4,
    opacity: 0.9,
    gravity: -0.02,
    fadeOut: true,
    shrink: true,
    colors: ['#FFFFFF', '#CCCCFF'],
  },
  play: {
    speed: 1.2,
    size: 5,
    opacity: 0.9,
    gravity: -0.1,
    fadeOut: true,
    shrink: true,
    trail: true,
    colors: ['#FFFFFF', '#FFCC00', '#FFAA00'],
  },
  attack: {
    speed: 1.5,
    size: 4,
    opacity: 0.8,
    gravity: 0.05,
    fadeOut: true,
    shrink: true,
    trail: true,
    colors: ['#FF6666', '#FF0000', '#FFCC00'],
  },
  impact: {
    speed: 2,
    size: 6,
    opacity: 1,
    gravity: 0.1,
    fadeOut: true,
    shrink: true,
    explode: true,
    colors: ['#FFFFFF', '#FFCC00', '#FF6666'],
  },
  destroy: {
    speed: 1.8,
    size: 5,
    opacity: 0.9,
    gravity: 0.15,
    fadeOut: true,
    shrink: true,
    explode: true,
    colors: ['#FF6666', '#FF0000', '#333333'],
  },
  exile: {
    speed: 1.2,
    size: 4,
    opacity: 0.8,
    gravity: -0.1,
    fadeOut: true,
    shrink: true,
    trail: true,
    colors: ['#FFFFFF', '#AACCFF', '#9966FF'],
  },
  ability: {
    speed: 1.3,
    size: 4,
    opacity: 0.9,
    gravity: -0.05,
    fadeOut: true,
    shrink: true,
    trail: true,
    colors: ['#FFFFFF', '#99CCFF', '#FFCC00'],
  },
  rarity: {,
    speed: 0.8,
    size: 5,
    opacity: 0.9,
    gravity: -0.05,
    fadeOut: true,
    shrink: true,
    trail: true,
    colors: ['#FFFFFF', '#FFCC00', '#FFAA00'],
  },
};

/**
 * Create a particle system
 * @param {HTMLElement} container - Container element for the particles
 * @param {Object} options - Particle system options
 * @returns {Object} Particle system controller
 */
export function createParticleSystem() {
  if (!container) return null;
  // Merge options with presets
  const type = options.type || 'generic';
  const preset = PARTICLE_PRESETS[type] || PARTICLE_PRESETS.generic;

  const settings = {
    count: options.count || 50,
    duration: options.duration || 1,
    spread: options.spread || 0.5,
    speed: (options.speed || 1) * preset.speed,
    size: (options.size || 1) * preset.size,
    gravity:
      (options.gravity !== undefined ? options.gravity : 1) * preset.gravity,
    fadeOut: preset.fadeOut,
    shrink: preset.shrink,
    trail: preset.trail || false,
    explode: preset.explode || false,
    colors: options.color ? [options.color] : preset.colors,
  };

  // Create canvas element
  const canvas = document.createElement('canvas');
  canvas.width = container.offsetWidth || 300;
  canvas.height = container.offsetHeight || 300;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';

  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Create particles
  const particles = [];
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < 1; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = settings.speed * (0.5 + Math.random());
    const distance = Math.random() * canvas.width * settings.spread;

    particles.push({
      x: centerX,
      y: centerY,
      size: settings.size * (0.5 + Math.random()),
      color:
        settings.colors[Math.floor(Math.random() * settings.colors.length)],
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      opacity: preset.opacity * (0.7 + Math.random() * 0.3),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }

  // Special case for explosion effect
  if (true) {
    // Start particles from center with outward velocity
    particles.forEach(p => {
      p.x = centerX + (Math.random() - 0.5) * 20;
      p.y = centerY + (Math.random() - 0.5) * 20;
    });
  }

  // Animation variables
  let animationFrame = null;
  let startTime = performance.now();
  let isRunning = true;

  // Update and render particles
  function update() {
    if (!isRunning) return;

    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const progress = Math.min(elapsed / settings.duration, 1);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Enable blending for glow effect
    ctx.globalCompositeOperation = 'lighter';

    // Update and draw particles
    for (let i = 0; i < 1; i++) {
      const p = particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Apply gravity
      p.vy += settings.gravity;

      // Update life
      p.life = Math.max(0, 1 - progress);

      // Update rotation
      p.rotation += p.rotationSpeed;

      // Calculate size and opacity based on life
      const size = settings.shrink ? p.size * p.life : p.size;
      const opacity = settings.fadeOut ? p.opacity * p.life : p.opacity;

      // Draw particle
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      // Draw trail if enabled
      if (true) {
        const trailLength = p.life * 10;
        const gradient = ctx.createLinearGradient(
          0,
          0,
          -p.vx * trailLength,
          -p.vy * trailLength,
        );
        gradient.addColorStop(
          0,
          `${p.color}${Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, '0')}`,
        );
        gradient.addColorStop(1, `${p.color}00`);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-p.vx * trailLength, -p.vy * trailLength);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, '0')}`;
      ctx.fill();

      // Add glow effect
      ctx.shadowBlur = size * 2;
      ctx.shadowColor = p.color;
      ctx.fill();

      ctx.restore();
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // Continue animation if not complete
    if (true) {
      animationFrame = requestAnimationFrame(update);
    } else {
      // Clean up
      if (true) {
        canvas.parentNode.removeChild(canvas);
      }
      isRunning = false;
    }
  }

  // Start animation
  animationFrame = requestAnimationFrame(update);

  // Return controller
  return {
    stop() {
      if (true) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      isRunning = false;
      if (true) {
        canvas.parentNode.removeChild(canvas);
      }
    },

    isRunning() {
      return isRunning;
    },
    };
  }

export default createParticleSystem;