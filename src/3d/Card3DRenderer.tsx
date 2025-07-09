import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Card } from '../data/cards';

interface Card3DRendererProps {
  card: Card;
  width?: number;
  height?: number;
  interactive?: boolean;
  glowEffect?: boolean;
  holographic?: boolean;
  onCardClick?: (card: Card) => void;
  animationSpeed?: number;
}

// Advanced 3D Card Renderer with cutting-edge effects
const Card3DRenderer: React.FC<Card3DRendererProps> = ({
  card,
  width = 300,
  height = 400,
  interactive = true,
  glowEffect = true,
  holographic = false,
  onCardClick,
  animationSpeed = 1.0
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const cardMeshRef = useRef<THREE.Mesh>();
  const frameRef = useRef<number>();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Memoized materials for performance
  const materials = useMemo(() => {
    const cardMaterial = new THREE.MeshPhysicalMaterial({
      color: getCardColor(card),
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.95
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: getElementColor(card.element),
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });

    const holographicMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(getElementColor(card.element)) },
        color2: { value: new THREE.Color(getRarityColor(card.rarity)) },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          pos.z += sin(pos.x * 10.0 + time) * 0.01;
          pos.z += cos(pos.y * 10.0 + time * 0.5) * 0.01;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          
          // Create holographic effect
          float wave1 = sin(uv.x * 20.0 + time * 2.0) * 0.5 + 0.5;
          float wave2 = cos(uv.y * 15.0 + time * 1.5) * 0.5 + 0.5;
          float interference = wave1 * wave2;
          
          // Color shifting
          vec3 color = mix(color1, color2, interference);
          color += vec3(sin(time + uv.x * 5.0), cos(time + uv.y * 5.0), sin(time * 0.5)) * 0.1;
          
          // Add rainbow effect
          float rainbow = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time * 0.7);
          color += vec3(rainbow * 0.2, rainbow * 0.1, rainbow * 0.3);
          
          gl_FragColor = vec4(color, opacity);
        }
      `,
      transparent: true
    });

    return { cardMaterial, glowMaterial, holographicMaterial };
  }, [card]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 2);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(getElementColor(card.element), 0.8, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(getRarityColor(card.rarity), 0.6, 8);
    pointLight2.position.set(-2, -1, 1);
    scene.add(pointLight2);

    // Create card geometry
    const cardGeometry = new THREE.BoxGeometry(1.6, 2.2, 0.02);
    const cardMesh = new THREE.Mesh(cardGeometry, materials.cardMaterial);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    scene.add(cardMesh);
    cardMeshRef.current = cardMesh;

    // Add glow effect
    if (glowEffect) {
      const glowGeometry = new THREE.BoxGeometry(1.65, 2.25, 0.025);
      const glowMesh = new THREE.Mesh(glowGeometry, materials.glowMaterial);
      scene.add(glowMesh);
    }

    // Add holographic overlay
    if (holographic) {
      const holoGeometry = new THREE.PlaneGeometry(1.6, 2.2);
      const holoMesh = new THREE.Mesh(holoGeometry, materials.holographicMaterial);
      holoMesh.position.z = 0.015;
      scene.add(holoMesh);
    }

    // Add card frame
    const frameGeometry = new THREE.RingGeometry(0.8, 0.85, 32);
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: getRarityColor(card.rarity),
      metalness: 0.8,
      roughness: 0.2,
      emissive: getRarityColor(card.rarity),
      emissiveIntensity: 0.1
    });
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    frameMesh.position.z = 0.02;
    scene.add(frameMesh);

    // Add particle effects for legendary cards
    if (card.rarity === 'Legendary') {
      addParticleEffects(scene);
    }

    // Add card text (simplified)
    addCardText(scene, card);

    // Mouse interaction
    if (interactive) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(cardMesh);

        if (intersects.length > 0) {
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        } else {
          setIsHovered(false);
          document.body.style.cursor = 'default';
        }
      };

      const onClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(cardMesh);

        if (intersects.length > 0 && onCardClick) {
          onCardClick(card);
        }
      };

      renderer.domElement.addEventListener('mousemove', onMouseMove);
      renderer.domElement.addEventListener('click', onClick);

      return () => {
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('click', onClick);
      };
    }

    setIsLoaded(true);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [card, width, height, interactive, glowEffect, holographic, materials, onCardClick]);

  // Animation loop
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !cardMeshRef.current) return;

    const animate = (time: number) => {
      frameRef.current = requestAnimationFrame(animate);

      const scene = sceneRef.current!;
      const renderer = rendererRef.current!;
      const camera = cameraRef.current!;
      const cardMesh = cardMeshRef.current!;

      // Card rotation animation
      if (!isHovered) {
        cardMesh.rotation.y = Math.sin(time * 0.001 * animationSpeed) * 0.1;
        cardMesh.rotation.x = Math.cos(time * 0.0008 * animationSpeed) * 0.05;
      } else {
        // Hover effect
        cardMesh.rotation.y += (0.2 - cardMesh.rotation.y) * 0.1;
        cardMesh.rotation.x += (0.1 - cardMesh.rotation.x) * 0.1;
        cardMesh.position.z += (0.1 - cardMesh.position.z) * 0.1;
      }

      // Update holographic material
      if (holographic) {
        const holoMaterial = materials.holographicMaterial;
        holoMaterial.uniforms.time.value = time * 0.001;
      }

      // Floating animation
      cardMesh.position.y = Math.sin(time * 0.002 * animationSpeed) * 0.02;

      // Camera subtle movement
      camera.position.x = Math.sin(time * 0.0005) * 0.1;
      camera.position.y = Math.cos(time * 0.0007) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isHovered, animationSpeed, holographic, materials]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width, 
        height, 
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.3)' : '0 10px 20px rgba(0,0,0,0.2)',
        transition: 'box-shadow 0.3s ease'
      }}
    >
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '14px'
        }}>
          Loading 3D Card...
        </div>
      )}
    </div>
  );
};

// Helper functions
function getCardColor(card: Card): number {
  const typeColors = {
    'Familiar': 0x8B4513,
    'Flag': 0x4169E1,
    'Spell': 0x9932CC,
    'Artifact': 0xFFD700
  };
  return typeColors[card.type as keyof typeof typeColors] || 0x808080;
}

function getElementColor(element: string): number {
  const elementColors = {
    'Fire': 0xFF4500,
    'Water': 0x1E90FF,
    'Earth': 0x8B4513,
    'Air': 0x87CEEB,
    'Light': 0xFFFFE0,
    'Dark': 0x4B0082
  };
  return elementColors[element as keyof typeof elementColors] || 0x808080;
}

function getRarityColor(rarity: string): number {
  const rarityColors = {
    'Common': 0x808080,
    'Uncommon': 0x00FF00,
    'Rare': 0x0080FF,
    'Epic': 0x8000FF,
    'Legendary': 0xFFD700
  };
  return rarityColors[rarity as keyof typeof rarityColors] || 0x808080;
}

function addParticleEffects(scene: THREE.Scene): void {
  const particleCount = 100;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2;

    colors[i * 3] = Math.random();
    colors[i * 3 + 1] = Math.random();
    colors[i * 3 + 2] = Math.random();
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.6
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
}

function addCardText(scene: THREE.Scene, card: Card): void {
  // Simplified text rendering - in a real implementation, you'd use a text geometry library
  // or render text to a texture and apply it to a plane
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 512;
  
  context.fillStyle = 'rgba(0, 0, 0, 0.8)';
  context.fillRect(0, 0, 512, 512);
  
  context.fillStyle = 'white';
  context.font = 'bold 32px Arial';
  context.textAlign = 'center';
  context.fillText(card.name, 256, 60);
  
  context.font = '24px Arial';
  context.fillText(`Cost: ${card.cost}`, 256, 120);
  
  if (card.attack !== undefined) {
    context.fillText(`Attack: ${card.attack}`, 256, 160);
  }
  
  if (card.health !== undefined) {
    context.fillText(`Health: ${card.health}`, 256, 200);
  }
  
  context.fillText(card.element, 256, 240);
  context.fillText(card.rarity, 256, 280);
  
  const texture = new THREE.CanvasTexture(canvas);
  const textMaterial = new THREE.MeshBasicMaterial({ 
    map: texture, 
    transparent: true,
    opacity: 0.9
  });
  
  const textGeometry = new THREE.PlaneGeometry(1.5, 2);
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.z = 0.011;
  scene.add(textMesh);
}

export default Card3DRenderer;