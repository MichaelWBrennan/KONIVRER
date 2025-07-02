import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { useTheme } from '../hooks/useTheme';
import { detectWebGPU } from '../utils/webgpu';

/**
 * WebGPU-powered card renderer component
 * Uses hardware-accelerated graphics for photorealistic card rendering with
 * advanced lighting, reflections, and particle effects
 */
const WebGPUCardRenderer: React.FC<{
  cardId?: string;
  holographic?: boolean;
  foil?: boolean;
  animation?: 'rotate' | 'flip' | 'glow' | 'none';
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  width?: number;
  height?: number;
}> = ({
  cardId = 'KON001',
  holographic = false,
  foil = false,
  animation = 'none',
  quality = 'high',
  width = 400,
  height = 560,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isWebGPUSupported, setIsWebGPUSupported] = useState<boolean | null>(
    null,
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);
  const [renderTime, setRenderTime] = useState(0);
  const { isAncientTheme } = useTheme();

  // WebGPU references
  const deviceRef = useRef<GPUDevice | null>(null);
  const contextRef = useRef<GPUCanvasContext | null>(null);
  const pipelineRef = useRef<GPURenderPipeline | null>(null);
  const uniformBufferRef = useRef<GPUBuffer | null>(null);
  const vertexBufferRef = useRef<GPUBuffer | null>(null);
  const indexBufferRef = useRef<GPUBuffer | null>(null);
  const textureRef = useRef<GPUTexture | null>(null);
  const sampler1Ref = useRef<GPUSampler | null>(null);
  const sampler2Ref = useRef<GPUSampler | null>(null);
  const bindGroupRef = useRef<GPUBindGroup | null>(null);

  // Animation references
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsUpdateRef = useRef<number>(0);

  // Quality settings
  const qualitySettings = useMemo(
    () => ({
      low: {
        particleCount: 100,
        reflectionSamples: 4,
        shadowResolution: 512,
        textureSize: 1024,
        antialiasing: 'none' as const,
      },
      medium: {
        particleCount: 500,
        reflectionSamples: 16,
        shadowResolution: 1024,
        textureSize: 2048,
        antialiasing: 'msaa4x' as const,
      },
      high: {
        particleCount: 2000,
        reflectionSamples: 64,
        shadowResolution: 2048,
        textureSize: 4096,
        antialiasing: 'msaa4x' as const,
      },
      ultra: {
        particleCount: 5000,
        reflectionSamples: 256,
        shadowResolution: 4096,
        textureSize: 8192,
        antialiasing: 'msaa8x' as const,
      },
    }),
    [],
  );

  // Card database (simulated)
  const cardDatabase = useMemo(
    () => ({
      KON001: {
        name: 'Ancient Guardian',
        textureUrl: '/textures/ancient_guardian.webp',
        normalMapUrl: '/textures/ancient_guardian_normal.webp',
        roughnessMapUrl: '/textures/ancient_guardian_roughness.webp',
        metallicMapUrl: '/textures/ancient_guardian_metallic.webp',
        emissiveMapUrl: '/textures/ancient_guardian_emissive.webp',
        holographicMapUrl: '/textures/ancient_guardian_holographic.webp',
        foilMapUrl: '/textures/ancient_guardian_foil.webp',
        model3dUrl: '/models/ancient_guardian.glb',
      },
      KON004: {
        name: 'Ethereal Dragon',
        textureUrl: '/textures/ethereal_dragon.webp',
        normalMapUrl: '/textures/ethereal_dragon_normal.webp',
        roughnessMapUrl: '/textures/ethereal_dragon_roughness.webp',
        metallicMapUrl: '/textures/ethereal_dragon_metallic.webp',
        emissiveMapUrl: '/textures/ethereal_dragon_emissive.webp',
        holographicMapUrl: '/textures/ethereal_dragon_holographic.webp',
        foilMapUrl: '/textures/ethereal_dragon_foil.webp',
        model3dUrl: '/models/ethereal_dragon.glb',
      },
    }),
    [],
  );

  // Shader code
  const shaderCode = useMemo(() => {
    return /* wgsl */ `
      struct VertexInput {
        @location(0) position: vec3<f32>,
        @location(1) texCoord: vec2<f32>,
        @location(2) normal: vec3<f32>,
        @location(3) tangent: vec3<f32>,
        @location(4) bitangent: vec3<f32>,
      };
      
      struct VertexOutput {
        @builtin(position) position: vec4<f32>,
        @location(0) texCoord: vec2<f32>,
        @location(1) normal: vec3<f32>,
        @location(2) tangent: vec3<f32>,
        @location(3) bitangent: vec3<f32>,
        @location(4) worldPos: vec3<f32>,
      };
      
      struct Uniforms {
        modelViewProjection: mat4x4<f32>,
        modelMatrix: mat4x4<f32>,
        normalMatrix: mat4x4<f32>,
        cameraPosition: vec3<f32>,
        time: f32,
        holographicFactor: f32,
        foilFactor: f32,
        animationFactor: f32,
        lightPosition: vec3<f32>,
        lightColor: vec3<f32>,
        ambientColor: vec3<f32>,
        reflectionStrength: f32,
        refractionStrength: f32,
      };
      
      @group(0) @binding(0) var<uniform> uniforms: Uniforms;
      @group(0) @binding(1) var baseTexture: texture_2d<f32>;
      @group(0) @binding(2) var normalMap: texture_2d<f32>;
      @group(0) @binding(3) var roughnessMap: texture_2d<f32>;
      @group(0) @binding(4) var metallicMap: texture_2d<f32>;
      @group(0) @binding(5) var emissiveMap: texture_2d<f32>;
      @group(0) @binding(6) var holographicMap: texture_2d<f32>;
      @group(0) @binding(7) var foilMap: texture_2d<f32>;
      @group(0) @binding(8) var textureSampler: sampler;
      @group(0) @binding(9) var repeatSampler: sampler;
      
      @vertex
      fn vertexMain(input: VertexInput) -> VertexOutput {
        var output: VertexOutput;
        
        // Apply animation
        var position = input.position;
        if (uniforms.animationFactor > 0.0) {
          // Apply rotation or other animation effects
          let angle = uniforms.time * uniforms.animationFactor * 0.5;
          let rotationMatrix = mat3x3<f32>(
            cos(angle), 0.0, sin(angle),
            0.0, 1.0, 0.0,
            -sin(angle), 0.0, cos(angle)
          );
          position = rotationMatrix * position;
        }
        
        // Apply holographic effect
        if (uniforms.holographicFactor > 0.0) {
          let wave = sin(position.y * 10.0 + uniforms.time * 2.0) * 0.01 * uniforms.holographicFactor;
          position.x += wave;
        }
        
        output.position = uniforms.modelViewProjection * vec4<f32>(position, 1.0);
        output.texCoord = input.texCoord;
        output.normal = (uniforms.normalMatrix * vec4<f32>(input.normal, 0.0)).xyz;
        output.tangent = (uniforms.normalMatrix * vec4<f32>(input.tangent, 0.0)).xyz;
        output.bitangent = (uniforms.normalMatrix * vec4<f32>(input.bitangent, 0.0)).xyz;
        output.worldPos = (uniforms.modelMatrix * vec4<f32>(position, 1.0)).xyz;
        
        return output;
      }
      
      @fragment
      fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
        // Sample textures
        let baseColor = textureSample(baseTexture, textureSampler, input.texCoord);
        let normalValue = textureSample(normalMap, textureSampler, input.texCoord).xyz * 2.0 - 1.0;
        let roughness = textureSample(roughnessMap, textureSampler, input.texCoord).r;
        let metallic = textureSample(metallicMap, textureSampler, input.texCoord).r;
        let emissive = textureSample(emissiveMap, textureSampler, input.texCoord).rgb;
        
        // Calculate TBN matrix for normal mapping
        let N = normalize(input.normal);
        let T = normalize(input.tangent);
        let B = normalize(input.bitangent);
        let TBN = mat3x3<f32>(T, B, N);
        
        // Apply normal mapping
        let worldNormal = TBN * normalValue;
        
        // Calculate lighting
        let lightDir = normalize(uniforms.lightPosition - input.worldPos);
        let viewDir = normalize(uniforms.cameraPosition - input.worldPos);
        let halfDir = normalize(lightDir + viewDir);
        
        // Diffuse lighting
        let NdotL = max(dot(worldNormal, lightDir), 0.0);
        let diffuse = uniforms.lightColor * NdotL;
        
        // Specular lighting (GGX)
        let NdotH = max(dot(worldNormal, halfDir), 0.0);
        let NdotV = max(dot(worldNormal, viewDir), 0.0);
        let alpha = roughness * roughness;
        let alpha2 = alpha * alpha;
        let denom = NdotH * NdotH * (alpha2 - 1.0) + 1.0;
        let D = alpha2 / (3.14159 * denom * denom);
        
        let F0 = mix(vec3<f32>(0.04), baseColor.rgb, metallic);
        let F = F0 + (1.0 - F0) * pow(1.0 - NdotV, 5.0);
        
        let specular = D * F * 0.25;
        
        // Ambient lighting
        let ambient = uniforms.ambientColor;
        
        // Holographic effect
        var holographicColor = vec3<f32>(0.0);
        if (uniforms.holographicFactor > 0.0) {
          let holoUV = input.texCoord + vec2<f32>(
            sin(input.worldPos.y * 10.0 + uniforms.time * 2.0) * 0.02,
            cos(input.worldPos.x * 10.0 + uniforms.time * 1.5) * 0.02
          ) * uniforms.holographicFactor;
          
          let holographicValue = textureSample(holographicMap, repeatSampler, holoUV).rgb;
          let rainbowEffect = vec3<f32>(
            sin(input.texCoord.x * 20.0 + uniforms.time) * 0.5 + 0.5,
            sin(input.texCoord.x * 20.0 + uniforms.time + 2.094) * 0.5 + 0.5,
            sin(input.texCoord.x * 20.0 + uniforms.time + 4.188) * 0.5 + 0.5
          );
          
          holographicColor = holographicValue * rainbowEffect * uniforms.holographicFactor;
        }
        
        // Foil effect
        var foilColor = vec3<f32>(0.0);
        if (uniforms.foilFactor > 0.0) {
          let foilUV = input.texCoord + vec2<f32>(
            sin(input.texCoord.y * 50.0 + uniforms.time) * 0.01,
            cos(input.texCoord.x * 50.0 + uniforms.time * 0.7) * 0.01
          ) * uniforms.foilFactor;
          
          let foilValue = textureSample(foilMap, repeatSampler, foilUV).rgb;
          let angle = atan2(viewDir.z, viewDir.x) + uniforms.time * 0.5;
          let foilShimmer = vec3<f32>(
            sin(angle) * 0.5 + 0.5,
            sin(angle + 2.094) * 0.5 + 0.5,
            sin(angle + 4.188) * 0.5 + 0.5
          );
          
          foilColor = foilValue * foilShimmer * uniforms.foilFactor * (1.0 - roughness);
        }
        
        // Combine all lighting components
        let lighting = ambient + diffuse;
        let finalColor = (baseColor.rgb * lighting + specular + emissive) + holographicColor + foilColor;
        
        // Apply tone mapping (ACES)
        let a = 2.51;
        let b = 0.03;
        let c = 2.43;
        let d = 0.59;
        let e = 0.14;
        let tonemapped = (finalColor * (a * finalColor + b)) / (finalColor * (c * finalColor + d) + e);
        
        // Apply gamma correction
        let gammaCorrected = pow(tonemapped, vec3<f32>(1.0 / 2.2));
        
        return vec4<f32>(gammaCorrected, baseColor.a);
      }
    `;
  }, []);

  // Check for WebGPU support
  useEffect(() => {
    const checkWebGPU = async () => {
      try {
        const supported = await detectWebGPU();
        setIsWebGPUSupported(supported);

        if (!supported) {
          setError(
            'WebGPU is not supported in your browser. Please use Chrome 113+, Edge 113+, or Safari 17+.',
          );
        }
      } catch (err) {
        setError(
          `Error detecting WebGPU: ${err instanceof Error ? err.message : String(err)}`,
        );
        setIsWebGPUSupported(false);
      }
    };

    checkWebGPU();
  }, []);

  // Initialize WebGPU
  const initWebGPU = useCallback(async () => {
    if (!canvasRef.current || !isWebGPUSupported) return;

    try {
      // Get WebGPU adapter
      const adapter = await navigator.gpu?.requestAdapter({
        powerPreference: 'high-performance',
      });

      if (!adapter) {
        throw new Error('No WebGPU adapter found');
      }

      // Get WebGPU device
      const device = await adapter.requestDevice({
        requiredFeatures: ['texture-compression-bc'],
        requiredLimits: {
          maxStorageBufferBindingSize:
            adapter.limits.maxStorageBufferBindingSize,
          maxBufferSize: adapter.limits.maxBufferSize,
          maxBindGroups: adapter.limits.maxBindGroups,
          maxBindingsPerBindGroup: adapter.limits.maxBindingsPerBindGroup,
          maxDynamicUniformBuffersPerPipelineLayout:
            adapter.limits.maxDynamicUniformBuffersPerPipelineLayout,
          maxDynamicStorageBuffersPerPipelineLayout:
            adapter.limits.maxDynamicStorageBuffersPerPipelineLayout,
          maxSampledTexturesPerShaderStage:
            adapter.limits.maxSampledTexturesPerShaderStage,
          maxSamplersPerShaderStage: adapter.limits.maxSamplersPerShaderStage,
          maxStorageBuffersPerShaderStage:
            adapter.limits.maxStorageBuffersPerShaderStage,
          maxStorageTexturesPerShaderStage:
            adapter.limits.maxStorageTexturesPerShaderStage,
          maxUniformBuffersPerShaderStage:
            adapter.limits.maxUniformBuffersPerShaderStage,
          maxUniformBufferBindingSize:
            adapter.limits.maxUniformBufferBindingSize,
        },
      });

      deviceRef.current = device;

      // Configure canvas
      const context = canvasRef.current.getContext('webgpu');
      if (!context) {
        throw new Error('Could not get WebGPU context from canvas');
      }

      contextRef.current = context;

      const format = navigator.gpu.getPreferredCanvasFormat();

      context.configure({
        device,
        format,
        alphaMode: 'premultiplied',
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
        viewFormats: [format],
      });

      // Create shader module
      const shaderModule = device.createShaderModule({
        code: shaderCode,
      });

      // Create uniform buffer
      const uniformBuffer = device.createBuffer({
        size: 256, // Aligned to 256 bytes
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      uniformBufferRef.current = uniformBuffer;

      // Create vertex buffer (card quad)
      const vertices = new Float32Array([
        // Position (x,y,z), TexCoord (u,v), Normal (x,y,z), Tangent (x,y,z), Bitangent (x,y,z)
        // Front face
        -0.5,
        -0.7,
        0.0,
        0.0,
        1.0,
        0.0,
        0.0,
        1.0,
        1.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0, // Bottom left
        0.5,
        -0.7,
        0.0,
        1.0,
        1.0,
        0.0,
        0.0,
        1.0,
        1.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0, // Bottom right
        0.5,
        0.7,
        0.0,
        1.0,
        0.0,
        0.0,
        0.0,
        1.0,
        1.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0, // Top right
        -0.5,
        0.7,
        0.0,
        0.0,
        0.0,
        0.0,
        0.0,
        1.0,
        1.0,
        0.0,
        0.0,
        0.0,
        1.0,
        0.0, // Top left
      ]);

      const vertexBuffer = device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
      });

      new Float32Array(vertexBuffer.getMappedRange()).set(vertices);
      vertexBuffer.unmap();

      vertexBufferRef.current = vertexBuffer;

      // Create index buffer
      const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

      const indexBuffer = device.createBuffer({
        size: indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
      });

      new Uint16Array(indexBuffer.getMappedRange()).set(indices);
      indexBuffer.unmap();

      indexBufferRef.current = indexBuffer;

      // Create dummy textures (would be replaced with actual textures)
      const createDummyTexture = () => {
        const textureSize = { width: 1, height: 1 };
        const texture = device.createTexture({
          size: textureSize,
          format: 'rgba8unorm',
          usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT,
        });

        const data = new Uint8Array([255, 255, 255, 255]);
        device.queue.writeTexture(
          { texture },
          data,
          { bytesPerRow: 4, rowsPerImage: 1 },
          textureSize,
        );

        return texture;
      };

      textureRef.current = createDummyTexture();

      // Create samplers
      const sampler1 = device.createSampler({
        addressModeU: 'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        magFilter: 'linear',
        minFilter: 'linear',
        mipmapFilter: 'linear',
        maxAnisotropy: 16,
      });

      const sampler2 = device.createSampler({
        addressModeU: 'repeat',
        addressModeV: 'repeat',
        magFilter: 'linear',
        minFilter: 'linear',
        mipmapFilter: 'linear',
      });

      sampler1Ref.current = sampler1;
      sampler2Ref.current = sampler2;

      // Create bind group layout
      const bindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: 'uniform' },
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: 'float' },
          },
          {
            binding: 2,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: 'float' },
          },
          {
            binding: 3,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: 'float' },
          },
          {
            binding: 4,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: 'float' },
          },
          {
            binding: 5,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: 'float' },
          },
          {
            binding: 6,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: 'float' },
          },
          {
            binding: 7,
            visibility: GPUShaderStage.FRAGMENT,
            texture: { sampleType: 'float' },
          },
          {
            binding: 8,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: { type: 'filtering' },
          },
          {
            binding: 9,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: { type: 'filtering' },
          },
        ],
      });

      // Create pipeline layout
      const pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout],
      });

      // Create render pipeline
      const pipeline = device.createRenderPipeline({
        layout: pipelineLayout,
        vertex: {
          module: shaderModule,
          entryPoint: 'vertexMain',
          buffers: [
            {
              arrayStride: 14 * 4, // 14 floats per vertex
              attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x3' }, // position
                { shaderLocation: 1, offset: 12, format: 'float32x2' }, // texCoord
                { shaderLocation: 2, offset: 20, format: 'float32x3' }, // normal
                { shaderLocation: 3, offset: 32, format: 'float32x3' }, // tangent
                { shaderLocation: 4, offset: 44, format: 'float32x3' }, // bitangent
              ],
            },
          ],
        },
        fragment: {
          module: shaderModule,
          entryPoint: 'fragmentMain',
          targets: [{ format }],
        },
        primitive: {
          topology: 'triangle-list',
          cullMode: 'back',
        },
        depthStencil: {
          depthWriteEnabled: true,
          depthCompare: 'less',
          format: 'depth24plus',
        },
        multisample: {
          count: quality === 'low' ? 1 : quality === 'ultra' ? 8 : 4,
        },
      });

      pipelineRef.current = pipeline;

      // Create bind group
      const bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: uniformBuffer } },
          { binding: 1, resource: textureRef.current.createView() },
          { binding: 2, resource: textureRef.current.createView() },
          { binding: 3, resource: textureRef.current.createView() },
          { binding: 4, resource: textureRef.current.createView() },
          { binding: 5, resource: textureRef.current.createView() },
          { binding: 6, resource: textureRef.current.createView() },
          { binding: 7, resource: textureRef.current.createView() },
          { binding: 8, resource: sampler1 },
          { binding: 9, resource: sampler2 },
        ],
      });

      bindGroupRef.current = bindGroup;

      // Create depth texture
      const depthTexture = device.createTexture({
        size: {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        },
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });

      // Start rendering
      setIsInitialized(true);

      // Load textures (simulated)
      console.log(`Would load textures for card ${cardId} here`);

      // Start animation loop
      requestAnimationFrame(renderFrame);
    } catch (err) {
      setError(
        `WebGPU initialization error: ${err instanceof Error ? err.message : String(err)}`,
      );
      console.error('WebGPU initialization error:', err);
    }
  }, [isWebGPUSupported, shaderCode, cardId, quality]);

  // Render frame function
  const renderFrame = useCallback(
    (timestamp: number) => {
      if (
        !deviceRef.current ||
        !contextRef.current ||
        !pipelineRef.current ||
        !uniformBufferRef.current ||
        !vertexBufferRef.current ||
        !indexBufferRef.current ||
        !bindGroupRef.current ||
        !canvasRef.current
      ) {
        return;
      }

      const device = deviceRef.current;
      const context = contextRef.current;
      const pipeline = pipelineRef.current;
      const uniformBuffer = uniformBufferRef.current;
      const vertexBuffer = vertexBufferRef.current;
      const indexBuffer = indexBufferRef.current;
      const bindGroup = bindGroupRef.current;

      // Calculate delta time
      const deltaTime = timestamp - (lastFrameTimeRef.current || timestamp);
      lastFrameTimeRef.current = timestamp;

      // Update time
      timeRef.current += deltaTime * 0.001; // Convert to seconds

      // Calculate FPS
      frameCountRef.current++;
      if (timestamp - lastFpsUpdateRef.current > 1000) {
        // Update FPS every second
        setFps(
          Math.round(
            (frameCountRef.current * 1000) /
              (timestamp - lastFpsUpdateRef.current),
          ),
        );
        frameCountRef.current = 0;
        lastFpsUpdateRef.current = timestamp;
      }

      // Start performance measurement
      const startTime = performance.now();

      // Create command encoder
      const commandEncoder = device.createCommandEncoder();

      // Create depth texture
      const depthTexture = device.createTexture({
        size: {
          width: canvasRef.current.width,
          height: canvasRef.current.height,
        },
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });

      // Get current texture view
      const textureView = context.getCurrentTexture().createView();

      // Create render pass
      const renderPass = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: textureView,
            clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
        depthStencilAttachment: {
          view: depthTexture.createView(),
          depthClearValue: 1.0,
          depthLoadOp: 'clear',
          depthStoreOp: 'store',
        },
      });

      // Set pipeline
      renderPass.setPipeline(pipeline);

      // Update uniform buffer
      const aspect = canvasRef.current.width / canvasRef.current.height;

      // Create projection matrix (perspective)
      const fov = (45 * Math.PI) / 180; // 45 degrees in radians
      const projectionMatrix = createPerspectiveMatrix(fov, aspect, 0.1, 100.0);

      // Create view matrix
      const viewMatrix = createLookAtMatrix(
        [0, 0, 2], // Camera position
        [0, 0, 0], // Look at position
        [0, 1, 0], // Up vector
      );

      // Create model matrix
      const modelMatrix = createIdentityMatrix();

      // Create model-view-projection matrix
      const mvpMatrix = multiplyMatrices(
        projectionMatrix,
        multiplyMatrices(viewMatrix, modelMatrix),
      );

      // Create normal matrix (inverse transpose of model matrix)
      const normalMatrix = createIdentityMatrix(); // Simplified for this example

      // Update uniform buffer
      const uniformData = new Float32Array([
        // modelViewProjection matrix (16 floats)
        ...mvpMatrix,
        // modelMatrix (16 floats)
        ...modelMatrix,
        // normalMatrix (16 floats)
        ...normalMatrix,
        // cameraPosition (3 floats)
        0,
        0,
        2,
        // padding (1 float)
        0,
        // time (1 float)
        timeRef.current,
        // holographicFactor (1 float)
        holographic ? 1.0 : 0.0,
        // foilFactor (1 float)
        foil ? 1.0 : 0.0,
        // animationFactor (1 float)
        animation === 'none'
          ? 0.0
          : animation === 'rotate'
            ? 1.0
            : animation === 'flip'
              ? 2.0
              : 3.0,
        // lightPosition (3 floats)
        1.0,
        1.0,
        2.0,
        // padding (1 float)
        0,
        // lightColor (3 floats)
        1.0,
        1.0,
        1.0,
        // padding (1 float)
        0,
        // ambientColor (3 floats)
        0.1,
        0.1,
        0.1,
        // padding (1 float)
        0,
        // reflectionStrength (1 float)
        0.5,
        // refractionStrength (1 float)
        0.3,
        // padding (2 floats)
        0,
        0,
      ]);

      device.queue.writeBuffer(uniformBuffer, 0, uniformData);

      // Set bind group
      renderPass.setBindGroup(0, bindGroup);

      // Set vertex buffer
      renderPass.setVertexBuffer(0, vertexBuffer);

      // Set index buffer
      renderPass.setIndexBuffer(indexBuffer, 'uint16');

      // Draw
      renderPass.drawIndexed(6); // 6 indices for 2 triangles

      // End render pass
      renderPass.end();

      // Submit command buffer
      device.queue.submit([commandEncoder.finish()]);

      // Clean up
      depthTexture.destroy();

      // End performance measurement
      const endTime = performance.now();
      setRenderTime(endTime - startTime);

      // Request next frame
      rafRef.current = requestAnimationFrame(renderFrame);
    },
    [holographic, foil, animation],
  );

  // Initialize WebGPU when supported
  useEffect(() => {
    if (isWebGPUSupported && !isInitialized && canvasRef.current) {
      initWebGPU();
    }

    return () => {
      // Clean up
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isWebGPUSupported, isInitialized, initWebGPU]);

  // Resize canvas when dimensions change
  useEffect(() => {
    if (!canvasRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const canvas = entry.target as HTMLCanvasElement;
        const width = entry.contentBoxSize[0].inlineSize;
        const height = entry.contentBoxSize[0].blockSize;

        // Set canvas size with device pixel ratio for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Reinitialize if already initialized
        if (isInitialized) {
          // This would ideally just update the viewport and depth texture
          // but for simplicity, we'll just reinitialize everything
          setIsInitialized(false);
        }
      }
    });

    resizeObserver.observe(canvasRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isInitialized]);

  // Helper function to create perspective matrix
  const createPerspectiveMatrix = (
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) => {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    return [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) * nf,
      -1,
      0,
      0,
      2 * far * near * nf,
      0,
    ];
  };

  // Helper function to create look-at matrix
  const createLookAtMatrix = (
    eye: number[],
    center: number[],
    up: number[],
  ) => {
    const z = normalize([
      eye[0] - center[0],
      eye[1] - center[1],
      eye[2] - center[2],
    ]);

    const x = normalize(cross(up, z));
    const y = cross(z, x);

    return [
      x[0],
      y[0],
      z[0],
      0,
      x[1],
      y[1],
      z[1],
      0,
      x[2],
      y[2],
      z[2],
      0,
      -dot(x, eye),
      -dot(y, eye),
      -dot(z, eye),
      1,
    ];
  };

  // Helper function to create identity matrix
  const createIdentityMatrix = () => {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  };

  // Helper function to multiply matrices
  const multiplyMatrices = (a: number[], b: number[]) => {
    const result = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = sum;
      }
    }

    return result;
  };

  // Helper function to normalize a vector
  const normalize = (v: number[]) => {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / length, v[1] / length, v[2] / length];
  };

  // Helper function to calculate cross product
  const cross = (a: number[], b: number[]) => {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  };

  // Helper function to calculate dot product
  const dot = (a: number[], b: number[]) => {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  };

  return (
    <div
      className={`webgpu-card-renderer ${isAncientTheme ? 'ancient-theme' : ''}`}
    >
      <div className="card-renderer-container" style={{ width, height }}>
        {isWebGPUSupported === false && (
          <div className="webgpu-error">
            <h3>WebGPU Not Supported</h3>
            <p>
              {error ||
                'Your browser does not support WebGPU. Please use Chrome 113+, Edge 113+, or Safari 17+.'}
            </p>
          </div>
        )}

        {isWebGPUSupported === true && !isInitialized && !error && (
          <div className="webgpu-loading">
            <div className="loading-spinner"></div>
            <p>Initializing WebGPU...</p>
          </div>
        )}

        {error && (
          <div className="webgpu-error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            display:
              isWebGPUSupported && isInitialized && !error ? 'block' : 'none',
            width: `${width}px`,
            height: `${height}px`,
          }}
        />
      </div>

      {isInitialized && !error && (
        <div className="card-renderer-stats">
          <div className="stat">
            <span>FPS:</span>
            <span className={fps < 30 ? 'low' : fps < 55 ? 'medium' : 'high'}>
              {fps}
            </span>
          </div>
          <div className="stat">
            <span>Render Time:</span>
            <span>{renderTime.toFixed(2)} ms</span>
          </div>
          <div className="stat">
            <span>Quality:</span>
            <span>{quality}</span>
          </div>
          <div className="stat">
            <span>Card:</span>
            <span>{cardId}</span>
          </div>
          <div className="stat">
            <span>Effects:</span>
            <span>
              {holographic ? 'Holographic ' : ''}
              {foil ? 'Foil ' : ''}
              {animation !== 'none' ? `${animation} ` : ''}
              {!holographic && !foil && animation === 'none' ? 'None' : ''}
            </span>
          </div>
        </div>
      )}

      <style jsx>{`
        .webgpu-card-renderer {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border-radius: 8px;
          background-color: ${isAncientTheme ? '#2c2b20' : '#ffffff'};
          color: ${isAncientTheme ? '#e0d8b8' : '#333333'};
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }

        .card-renderer-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background-color: ${isAncientTheme ? '#1a1914' : '#f0f0f0'};
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        canvas {
          display: block;
          width: 100%;
          height: 100%;
        }

        .webgpu-error,
        .webgpu-loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
          background-color: ${isAncientTheme
            ? 'rgba(28, 25, 20, 0.9)'
            : 'rgba(240, 240, 240, 0.9)'};
        }

        .webgpu-error h3 {
          color: ${isAncientTheme ? '#ff6b6b' : '#ff3333'};
          margin-bottom: 10px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: ${isAncientTheme ? '#8a7e55' : '#646cff'};
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .card-renderer-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
          padding: 10px;
          border-radius: 4px;
          background-color: ${isAncientTheme ? '#3a3828' : '#f5f5f5'};
          width: 100%;
        }

        .stat {
          display: flex;
          gap: 5px;
        }

        .stat span:first-child {
          font-weight: bold;
        }

        .stat span.low {
          color: ${isAncientTheme ? '#ff6b6b' : '#ff3333'};
        }

        .stat span.medium {
          color: ${isAncientTheme ? '#ffb347' : '#ff9800'};
        }

        .stat span.high {
          color: ${isAncientTheme ? '#77dd77' : '#4caf50'};
        }

        .ancient-theme h3 {
          font-family: 'Cinzel', serif;
          color: #d4b86a;
        }
      `}</style>
    </div>
  );
};

export default React.memo(WebGPUCardRenderer);
