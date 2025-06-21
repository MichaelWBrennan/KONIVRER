import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

/**
 * Advanced 3D Rendering Engine for KONIVRER
 * Handles WebGL rendering, 3D card models, particle effects, and visual enhancements
 */
export class RenderEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      ...options
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.loader = new GLTFLoader();
    
    // Asset management
    this.cardModels = new Map();
    this.textures = new Map();
    this.materials = new Map();
    this.particleSystems = new Map();
    
    // Animation system
    this.animationMixer = null;
    this.clock = new THREE.Clock();
    this.activeAnimations = new Set();
    
    // Performance monitoring
    this.stats = {
      frameTime: 0,
      drawCalls: 0,
      triangles: 0,
      memory: 0
    };

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupLighting();
    this.setupPostProcessing();
    this.setupEventListeners();
    
    // Start render loop
    this.animate();
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      ...this.options
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);
    this.camera.lookAt(0, 0, 0);
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);

    // Rim lighting for cards
    const rimLight = new THREE.DirectionalLight(0x4444ff, 0.5);
    rimLight.position.set(-5, 5, -5);
    this.scene.add(rimLight);

    // Point lights for magical effects
    const magicLight1 = new THREE.PointLight(0xff4444, 0.8, 10);
    magicLight1.position.set(3, 3, 3);
    this.scene.add(magicLight1);

    const magicLight2 = new THREE.PointLight(0x44ff44, 0.8, 10);
    magicLight2.position.set(-3, 3, -3);
    this.scene.add(magicLight2);
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    // Base render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Bloom effect for magical cards
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    this.composer.addPass(bloomPass);

    // Custom shader for card effects
    const cardEffectShader = {
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        cardGlow: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        uniform float cardGlow;
        varying vec2 vUv;
        
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          
          // Add magical shimmer effect
          float shimmer = sin(time * 3.0 + vUv.x * 10.0) * 0.1 * cardGlow;
          color.rgb += shimmer;
          
          gl_FragColor = color;
        }
      `
    };

    const cardEffectPass = new ShaderPass(cardEffectShader);
    this.composer.addPass(cardEffectPass);
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Load and cache a 3D card model
   */
  async loadCardModel(cardId, modelPath) {
    if (this.cardModels.has(cardId)) {
      return this.cardModels.get(cardId).clone();
    }

    try {
      const gltf = await new Promise((resolve, reject) => {
        this.loader.load(modelPath, resolve, undefined, reject);
      });

      const model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance materials for card-specific effects
          if (child.material) {
            child.material.envMapIntensity = 0.8;
            child.material.metalness = 0.1;
            child.material.roughness = 0.3;
          }
        }
      });

      this.cardModels.set(cardId, model);
      return model.clone();
    } catch (error) {
      console.error(`Failed to load card model for ${cardId}:`, error);
      return this.createFallbackCard(cardId);
    }
  }

  /**
   * Create a fallback 2D card when 3D model fails to load
   */
  createFallbackCard(cardId) {
    const geometry = new THREE.PlaneGeometry(2.5, 3.5);
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true
    });

    // Load card texture if available
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      `/cards/${cardId}.jpg`,
      (texture) => {
        material.map = texture;
        material.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback to solid color if texture fails
        material.color.setHex(0x333333);
      }
    );

    return new THREE.Mesh(geometry, material);
  }

  /**
   * Create particle system for spell effects
   */
  createSpellEffect(type, position, options = {}) {
    const particleCount = options.particleCount || 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Color based on spell type
      const color = this.getSpellColor(type);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Size
      sizes[i] = Math.random() * 2 + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pointTexture: { value: this.createParticleTexture() }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float time;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, 1.0);
          gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
          
          // Fade out over time
          float alpha = 1.0 - (time * 0.5);
          gl_FragColor.a *= alpha;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);
    
    this.scene.add(particles);
    this.particleSystems.set(particles.uuid, {
      system: particles,
      startTime: this.clock.getElapsedTime(),
      duration: options.duration || 3.0
    });

    return particles;
  }

  getSpellColor(type) {
    const colors = {
      fire: { r: 1.0, g: 0.3, b: 0.1 },
      water: { r: 0.1, g: 0.5, b: 1.0 },
      earth: { r: 0.5, g: 0.8, b: 0.2 },
      air: { r: 0.8, g: 0.8, b: 1.0 },
      dark: { r: 0.3, g: 0.1, b: 0.5 },
      light: { r: 1.0, g: 1.0, b: 0.8 },
      default: { r: 0.5, g: 0.5, b: 1.0 }
    };
    return colors[type] || colors.default;
  }

  createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    
    return new THREE.CanvasTexture(canvas);
  }

  /**
   * Animate card entrance with dramatic effect
   */
  animateCardEntrance(cardMesh, cardData) {
    const isLegendary = cardData.rarity === 'legendary';
    const isMythic = cardData.rarity === 'mythic';
    
    // Start position (off-screen)
    cardMesh.position.y = -10;
    cardMesh.rotation.x = Math.PI;
    cardMesh.scale.set(0, 0, 0);

    // Create entrance animation
    const animation = {
      mesh: cardMesh,
      startTime: this.clock.getElapsedTime(),
      duration: isLegendary || isMythic ? 2.0 : 1.0,
      type: 'entrance'
    };

    // Add special effects for rare cards
    if (isLegendary) {
      this.createSpellEffect('light', cardMesh.position, {
        particleCount: 500,
        duration: 2.0
      });
    } else if (isMythic) {
      this.createSpellEffect('dark', cardMesh.position, {
        particleCount: 800,
        duration: 2.5
      });
    }

    this.activeAnimations.add(animation);
    return animation;
  }

  /**
   * Update all active animations
   */
  updateAnimations() {
    const currentTime = this.clock.getElapsedTime();
    const completedAnimations = [];

    this.activeAnimations.forEach(animation => {
      const elapsed = currentTime - animation.startTime;
      const progress = Math.min(elapsed / animation.duration, 1);

      if (animation.type === 'entrance') {
        this.updateEntranceAnimation(animation, progress);
      }

      if (progress >= 1) {
        completedAnimations.push(animation);
      }
    });

    // Remove completed animations
    completedAnimations.forEach(animation => {
      this.activeAnimations.delete(animation);
    });

    // Update particle systems
    this.updateParticleSystems(currentTime);
  }

  updateEntranceAnimation(animation, progress) {
    const eased = this.easeOutBounce(progress);
    const mesh = animation.mesh;

    // Position
    mesh.position.y = -10 + (10 * eased);
    
    // Rotation
    mesh.rotation.x = Math.PI * (1 - eased);
    
    // Scale
    const scale = eased;
    mesh.scale.set(scale, scale, scale);

    // Add floating effect
    mesh.position.y += Math.sin(progress * Math.PI * 4) * 0.1;
  }

  updateParticleSystems(currentTime) {
    const expiredSystems = [];

    this.particleSystems.forEach((data, uuid) => {
      const elapsed = currentTime - data.startTime;
      const progress = elapsed / data.duration;

      if (progress >= 1) {
        this.scene.remove(data.system);
        expiredSystems.push(uuid);
      } else {
        // Update particle system uniforms
        if (data.system.material.uniforms.time) {
          data.system.material.uniforms.time.value = elapsed;
        }
      }
    });

    expiredSystems.forEach(uuid => {
      this.particleSystems.delete(uuid);
    });
  }

  easeOutBounce(t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    
    // Update animations
    this.updateAnimations();

    // Update animation mixer if present
    if (this.animationMixer) {
      this.animationMixer.update(delta);
    }

    // Render the scene
    this.composer.render();

    // Update performance stats
    this.updateStats();
  }

  updateStats() {
    this.stats.frameTime = this.clock.getDelta() * 1000;
    this.stats.drawCalls = this.renderer.info.render.calls;
    this.stats.triangles = this.renderer.info.render.triangles;
    this.stats.memory = this.renderer.info.memory.geometries + this.renderer.info.memory.textures;
  }

  /**
   * Clean up resources
   */
  dispose() {
    // Dispose of all geometries and materials
    this.cardModels.forEach(model => {
      model.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    });

    // Dispose of textures
    this.textures.forEach(texture => texture.dispose());

    // Dispose of particle systems
    this.particleSystems.forEach(data => {
      this.scene.remove(data.system);
      data.system.geometry.dispose();
      data.system.material.dispose();
    });

    // Dispose of renderer
    this.renderer.dispose();
  }

  /**
   * Get current performance metrics
   */
  getPerformanceStats() {
    return { ...this.stats };
  }
}

export default RenderEngine;