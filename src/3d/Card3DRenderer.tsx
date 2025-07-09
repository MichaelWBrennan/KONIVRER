import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export interface Card3DProps {
  cardData: {
    id: string;
    name: string;
    imageUrl?: string;
    cost: number;
    attack?: number;
    health?: number;
    type: string;
    rarity: string;
  };
  width?: number;
  height?: number;
  interactive?: boolean;
  holographic?: boolean;
  onCardClick?: (cardId: string) => void;
}

export const Card3DRenderer: React.FC<Card3DProps> = ({
  cardData,
  width = 300,
  height = 400,
  interactive = true,
  holographic = false,
  onCardClick
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cardMeshRef = useRef<THREE.Mesh>();
  const animationIdRef = useRef<number>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Point light for dramatic effect
    const pointLight = new THREE.PointLight(0x4a90e2, 1, 100);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // Create card geometry
    const cardGeometry = new THREE.BoxGeometry(2.5, 3.5, 0.1);
    
    // Create card material
    const cardMaterial = createCardMaterial(cardData, holographic);
    
    // Create card mesh
    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
    cardMesh.castShadow = true;
    cardMesh.receiveShadow = true;
    cardMeshRef.current = cardMesh;
    scene.add(cardMesh);

    // Add particle system for holographic effect
    if (holographic) {
      const particles = createParticleSystem();
      scene.add(particles);
    }

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Rotate card slightly for 3D effect
      if (cardMeshRef.current) {
        if (isHovered) {
          cardMeshRef.current.rotation.y += 0.01;
          cardMeshRef.current.position.z = Math.sin(Date.now() * 0.001) * 0.2;
        } else {
          cardMeshRef.current.rotation.y += 0.005;
        }
      }

      // Update holographic effect
      if (holographic && cardMaterial.uniforms) {
        cardMaterial.uniforms.time.value = Date.now() * 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive || !cardMeshRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Rotate card based on mouse position
      cardMeshRef.current.rotation.x = y * 0.3;
      cardMeshRef.current.rotation.y = x * 0.3;
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (cardMeshRef.current) {
        cardMeshRef.current.scale.set(1.1, 1.1, 1.1);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (cardMeshRef.current) {
        cardMeshRef.current.scale.set(1, 1, 1);
        cardMeshRef.current.rotation.x = 0;
        cardMeshRef.current.rotation.y = 0;
      }
    };

    const handleClick = () => {
      if (onCardClick) {
        onCardClick(cardData.id);
      }
    };

    if (interactive) {
      renderer.domElement.addEventListener('mousemove', handleMouseMove);
      renderer.domElement.addEventListener('mouseenter', handleMouseEnter);
      renderer.domElement.addEventListener('mouseleave', handleMouseLeave);
      renderer.domElement.addEventListener('click', handleClick);
    }

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (interactive) {
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('mouseenter', handleMouseEnter);
        renderer.domElement.removeEventListener('mouseleave', handleMouseLeave);
        renderer.domElement.removeEventListener('click', handleClick);
      }

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      cardGeometry.dispose();
      cardMaterial.dispose();
    };
  }, [cardData, width, height, interactive, holographic, isHovered, onCardClick]);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width, 
        height, 
        cursor: interactive ? 'pointer' : 'default',
        borderRadius: '10px',
        overflow: 'hidden'
      }} 
    />
  );
};

function createCardMaterial(cardData: any, holographic: boolean): THREE.Material {
  if (holographic) {
    // Holographic shader material
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(300, 400) },
        cardColor: { value: getRarityColor(cardData.rarity) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 cardColor;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec2 uv = vUv;
          
          // Holographic rainbow effect
          float rainbow = sin(uv.x * 10.0 + time) * sin(uv.y * 10.0 + time * 0.5);
          vec3 hologram = vec3(
            sin(rainbow + time) * 0.5 + 0.5,
            sin(rainbow + time + 2.094) * 0.5 + 0.5,
            sin(rainbow + time + 4.188) * 0.5 + 0.5
          );
          
          // Mix with card color
          vec3 finalColor = mix(cardColor, hologram, 0.3);
          
          // Add shimmer effect
          float shimmer = sin(uv.x * 20.0 + time * 2.0) * sin(uv.y * 20.0 + time * 2.0);
          finalColor += shimmer * 0.1;
          
          gl_FragColor = vec4(finalColor, 0.9);
        }
      `,
      transparent: true
    });
  } else {
    // Standard material with card texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Draw card background
    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    const rarityColor = getRarityColor(cardData.rarity);
    gradient.addColorStop(0, `rgb(${rarityColor.r * 255}, ${rarityColor.g * 255}, ${rarityColor.b * 255})`);
    gradient.addColorStop(1, '#1a1a2e');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Draw card border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 492, 492);
    
    // Draw card name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(cardData.name, 256, 50);
    
    // Draw cost
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(cardData.cost.toString(), 50, 50);
    
    // Draw stats if creature
    if (cardData.attack !== undefined && cardData.health !== undefined) {
      ctx.fillStyle = '#ff4444';
      ctx.fillText(cardData.attack.toString(), 100, 480);
      ctx.fillStyle = '#44ff44';
      ctx.fillText(cardData.health.toString(), 150, 480);
    }
    
    // Draw type
    ctx.fillStyle = '#cccccc';
    ctx.font = '18px Arial';
    ctx.fillText(cardData.type, 256, 480);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    return new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true
    });
  }
}

function createParticleSystem(): THREE.Points {
  const particleCount = 100;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x4a90e2,
    size: 0.1,
    transparent: true,
    opacity: 0.6
  });
  
  return new THREE.Points(particles, particleMaterial);
}

function getRarityColor(rarity: string): THREE.Color {
  switch (rarity.toLowerCase()) {
    case 'common':
      return new THREE.Color(0.7, 0.7, 0.7);
    case 'uncommon':
      return new THREE.Color(0.2, 0.8, 0.2);
    case 'rare':
      return new THREE.Color(0.2, 0.4, 0.9);
    case 'legendary':
      return new THREE.Color(0.9, 0.5, 0.1);
    default:
      return new THREE.Color(0.5, 0.5, 0.5);
  }
}

export default Card3DRenderer;