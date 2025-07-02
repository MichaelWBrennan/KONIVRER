/**
 * Utility functions for WebGPU detection and initialization
 */

/**
 * Detects if WebGPU is supported in the current browser
 * @returns Promise that resolves to true if WebGPU is supported, false otherwise
 */
export const detectWebGPU = async (): Promise<boolean> => {
  // Check if the navigator.gpu object exists
  if (!navigator.gpu) {
    return false;
  }

  try {
    // Try to get an adapter
    const adapter = await navigator.gpu.requestAdapter();

    // If no adapter is available, WebGPU is not supported
    if (!adapter) {
      return false;
    }

    // Check if the adapter supports the features we need
    const features = [
      'texture-compression-bc',
      'float32-filterable',
      'depth-clip-control',
    ];

    // Check adapter limits
    const requiredLimits = {
      maxBufferSize: 1 << 28, // 256MB
      maxStorageBufferBindingSize: 1 << 27, // 128MB
      maxBindGroups: 4,
      maxBindingsPerBindGroup: 16,
      maxSampledTexturesPerShaderStage: 16,
      maxSamplersPerShaderStage: 16,
    };

    // Check if the adapter meets our requirements
    let supported = true;

    // Check features
    for (const feature of features) {
      if (!adapter.features.has(feature as GPUFeatureName)) {
        console.warn(`WebGPU feature not supported: ${feature}`);
        // Don't return false immediately, as some features are optional
      }
    }

    // Check limits
    for (const [limit, value] of Object.entries(requiredLimits)) {
      const limitKey = limit as keyof GPUSupportedLimits;
      if (adapter.limits[limitKey] < value) {
        console.warn(
          `WebGPU limit not met: ${limit}. Required: ${value}, Available: ${adapter.limits[limitKey]}`,
        );
        // Some limits are critical, but for now we'll just warn
      }
    }

    // Get device to check if we can actually create one
    try {
      const device = await adapter.requestDevice();
      // If we got here, WebGPU is supported
      return true;
    } catch (e) {
      console.error('Failed to create WebGPU device:', e);
      return false;
    }
  } catch (e) {
    console.error('Error detecting WebGPU:', e);
    return false;
  }
};

/**
 * Gets information about the WebGPU adapter
 * @returns Promise that resolves to an object with adapter information
 */
export const getWebGPUInfo = async (): Promise<{
  supported: boolean;
  adapterInfo?: GPUAdapterInfo;
  features?: string[];
  limits?: Record<string, number>;
}> => {
  if (!navigator.gpu) {
    return { supported: false };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return { supported: false };
    }

    const adapterInfo = await adapter.requestAdapterInfo();
    const features = Array.from(adapter.features).map(feature =>
      feature.toString(),
    );
    const limits: Record<string, number> = {};

    // Get all limits
    for (const key in adapter.limits) {
      const limitKey = key as keyof GPUSupportedLimits;
      limits[key] = adapter.limits[limitKey];
    }

    return {
      supported: true,
      adapterInfo,
      features,
      limits,
    };
  } catch (e) {
    console.error('Error getting WebGPU info:', e);
    return { supported: false };
  }
};

/**
 * Creates a WebGPU device with the specified features and limits
 * @param requiredFeatures Array of required features
 * @param requiredLimits Object with required limits
 * @returns Promise that resolves to a WebGPU device
 */
export const createWebGPUDevice = async (
  requiredFeatures: GPUFeatureName[] = [],
  requiredLimits: Partial<GPURequiredLimits> = {},
): Promise<GPUDevice | null> => {
  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported in this browser');
  }

  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance',
    });

    if (!adapter) {
      throw new Error('No WebGPU adapter found');
    }

    // Check if all required features are supported
    for (const feature of requiredFeatures) {
      if (!adapter.features.has(feature)) {
        throw new Error(`Required WebGPU feature not supported: ${feature}`);
      }
    }

    // Create device with required features and limits
    const device = await adapter.requestDevice({
      requiredFeatures,
      requiredLimits,
    });

    return device;
  } catch (e) {
    console.error('Error creating WebGPU device:', e);
    return null;
  }
};

/**
 * Creates a WebGPU buffer
 * @param device WebGPU device
 * @param data Data to put in the buffer
 * @param usage Buffer usage flags
 * @returns WebGPU buffer
 */
export const createBuffer = (
  device: GPUDevice,
  data: Float32Array | Uint16Array | Uint32Array,
  usage: GPUBufferUsageFlags,
): GPUBuffer => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
    mappedAtCreation: true,
  });

  const arrayType =
    data instanceof Float32Array
      ? Float32Array
      : data instanceof Uint16Array
        ? Uint16Array
        : Uint32Array;

  new arrayType(buffer.getMappedRange()).set(data);
  buffer.unmap();

  return buffer;
};

/**
 * Creates a WebGPU texture from an image
 * @param device WebGPU device
 * @param image Image to create texture from
 * @param usage Texture usage flags
 * @returns Promise that resolves to a WebGPU texture
 */
export const createTextureFromImage = async (
  device: GPUDevice,
  image: HTMLImageElement,
  usage: GPUTextureUsageFlags = GPUTextureUsage.TEXTURE_BINDING |
    GPUTextureUsage.COPY_DST |
    GPUTextureUsage.RENDER_ATTACHMENT,
): Promise<GPUTexture> => {
  // Create a bitmap from the image
  const imageBitmap = await createImageBitmap(image);

  // Create the texture
  const texture = device.createTexture({
    size: {
      width: imageBitmap.width,
      height: imageBitmap.height,
    },
    format: 'rgba8unorm',
    usage,
  });

  // Copy the bitmap to the texture
  device.queue.copyExternalImageToTexture(
    { source: imageBitmap },
    { texture },
    {
      width: imageBitmap.width,
      height: imageBitmap.height,
    },
  );

  return texture;
};

/**
 * Creates a WebGPU shader module
 * @param device WebGPU device
 * @param code WGSL shader code
 * @returns WebGPU shader module
 */
export const createShaderModule = (
  device: GPUDevice,
  code: string,
): GPUShaderModule => {
  return device.createShaderModule({
    code,
  });
};

/**
 * Creates a WebGPU render pipeline
 * @param device WebGPU device
 * @param options Pipeline options
 * @returns WebGPU render pipeline
 */
export const createRenderPipeline = (
  device: GPUDevice,
  options: {
    layout: GPUPipelineLayout;
    vertex: {
      module: GPUShaderModule;
      entryPoint: string;
      buffers: GPUVertexBufferLayout[];
    };
    fragment: {
      module: GPUShaderModule;
      entryPoint: string;
      targets: GPUColorTargetState[];
    };
    primitive?: GPUPrimitiveState;
    depthStencil?: GPUDepthStencilState;
    multisample?: GPUMultisampleState;
  },
): GPURenderPipeline => {
  return device.createRenderPipeline({
    layout: options.layout,
    vertex: options.vertex,
    fragment: options.fragment,
    primitive: options.primitive || {
      topology: 'triangle-list',
      cullMode: 'back',
    },
    depthStencil: options.depthStencil,
    multisample: options.multisample,
  });
};

/**
 * Creates a WebGPU compute pipeline
 * @param device WebGPU device
 * @param options Pipeline options
 * @returns WebGPU compute pipeline
 */
export const createComputePipeline = (
  device: GPUDevice,
  options: {
    layout: GPUPipelineLayout;
    compute: {
      module: GPUShaderModule;
      entryPoint: string;
    };
  },
): GPUComputePipeline => {
  return device.createComputePipeline({
    layout: options.layout,
    compute: options.compute,
  });
};

/**
 * Creates a WebGPU bind group
 * @param device WebGPU device
 * @param layout Bind group layout
 * @param entries Bind group entries
 * @returns WebGPU bind group
 */
export const createBindGroup = (
  device: GPUDevice,
  layout: GPUBindGroupLayout,
  entries: GPUBindGroupEntry[],
): GPUBindGroup => {
  return device.createBindGroup({
    layout,
    entries,
  });
};

/**
 * Creates a WebGPU sampler
 * @param device WebGPU device
 * @param options Sampler options
 * @returns WebGPU sampler
 */
export const createSampler = (
  device: GPUDevice,
  options: GPUSamplerDescriptor = {},
): GPUSampler => {
  return device.createSampler(options);
};

/**
 * Creates a depth texture
 * @param device WebGPU device
 * @param width Texture width
 * @param height Texture height
 * @returns WebGPU texture
 */
export const createDepthTexture = (
  device: GPUDevice,
  width: number,
  height: number,
): GPUTexture => {
  return device.createTexture({
    size: { width, height },
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
};

/**
 * Checks if a specific WebGPU feature is supported
 * @param feature Feature to check
 * @returns Promise that resolves to true if the feature is supported, false otherwise
 */
export const isFeatureSupported = async (
  feature: GPUFeatureName,
): Promise<boolean> => {
  if (!navigator.gpu) {
    return false;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return false;
    }

    return adapter.features.has(feature);
  } catch (e) {
    console.error(`Error checking WebGPU feature support for ${feature}:`, e);
    return false;
  }
};

/**
 * Gets the maximum texture dimension supported by WebGPU
 * @returns Promise that resolves to the maximum texture dimension
 */
export const getMaxTextureDimension = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxTextureDimension2D;
  } catch (e) {
    console.error('Error getting max texture dimension:', e);
    return 0;
  }
};

/**
 * Gets the maximum compute workgroup size supported by WebGPU
 * @returns Promise that resolves to the maximum compute workgroup size
 */
export const getMaxComputeWorkgroupSize = async (): Promise<
  [number, number, number]
> => {
  if (!navigator.gpu) {
    return [0, 0, 0];
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return [0, 0, 0];
    }

    return [
      adapter.limits.maxComputeWorkgroupSizeX,
      adapter.limits.maxComputeWorkgroupSizeY,
      adapter.limits.maxComputeWorkgroupSizeZ,
    ];
  } catch (e) {
    console.error('Error getting max compute workgroup size:', e);
    return [0, 0, 0];
  }
};

/**
 * Gets the maximum number of storage buffers per shader stage
 * @returns Promise that resolves to the maximum number of storage buffers
 */
export const getMaxStorageBuffersPerShaderStage = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxStorageBuffersPerShaderStage;
  } catch (e) {
    console.error('Error getting max storage buffers per shader stage:', e);
    return 0;
  }
};

/**
 * Gets the maximum storage buffer binding size
 * @returns Promise that resolves to the maximum storage buffer binding size
 */
export const getMaxStorageBufferBindingSize = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxStorageBufferBindingSize;
  } catch (e) {
    console.error('Error getting max storage buffer binding size:', e);
    return 0;
  }
};

/**
 * Gets the maximum uniform buffer binding size
 * @returns Promise that resolves to the maximum uniform buffer binding size
 */
export const getMaxUniformBufferBindingSize = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxUniformBufferBindingSize;
  } catch (e) {
    console.error('Error getting max uniform buffer binding size:', e);
    return 0;
  }
};

/**
 * Gets the maximum number of bind groups
 * @returns Promise that resolves to the maximum number of bind groups
 */
export const getMaxBindGroups = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxBindGroups;
  } catch (e) {
    console.error('Error getting max bind groups:', e);
    return 0;
  }
};

/**
 * Gets the maximum number of bindings per bind group
 * @returns Promise that resolves to the maximum number of bindings per bind group
 */
export const getMaxBindingsPerBindGroup = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxBindingsPerBindGroup;
  } catch (e) {
    console.error('Error getting max bindings per bind group:', e);
    return 0;
  }
};

/**
 * Gets the maximum number of samplers per shader stage
 * @returns Promise that resolves to the maximum number of samplers per shader stage
 */
export const getMaxSamplersPerShaderStage = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxSamplersPerShaderStage;
  } catch (e) {
    console.error('Error getting max samplers per shader stage:', e);
    return 0;
  }
};

/**
 * Gets the maximum number of sampled textures per shader stage
 * @returns Promise that resolves to the maximum number of sampled textures per shader stage
 */
export const getMaxSampledTexturesPerShaderStage =
  async (): Promise<number> => {
    if (!navigator.gpu) {
      return 0;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();

      if (!adapter) {
        return 0;
      }

      return adapter.limits.maxSampledTexturesPerShaderStage;
    } catch (e) {
      console.error('Error getting max sampled textures per shader stage:', e);
      return 0;
    }
  };

/**
 * Gets the maximum number of storage textures per shader stage
 * @returns Promise that resolves to the maximum number of storage textures per shader stage
 */
export const getMaxStorageTexturesPerShaderStage =
  async (): Promise<number> => {
    if (!navigator.gpu) {
      return 0;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();

      if (!adapter) {
        return 0;
      }

      return adapter.limits.maxStorageTexturesPerShaderStage;
    } catch (e) {
      console.error('Error getting max storage textures per shader stage:', e);
      return 0;
    }
  };

/**
 * Gets the maximum buffer size
 * @returns Promise that resolves to the maximum buffer size
 */
export const getMaxBufferSize = async (): Promise<number> => {
  if (!navigator.gpu) {
    return 0;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return 0;
    }

    return adapter.limits.maxBufferSize;
  } catch (e) {
    console.error('Error getting max buffer size:', e);
    return 0;
  }
};

/**
 * Gets the preferred canvas format
 * @returns The preferred canvas format
 */
export const getPreferredCanvasFormat = (): GPUTextureFormat => {
  if (!navigator.gpu) {
    throw new Error('WebGPU is not supported in this browser');
  }

  return navigator.gpu.getPreferredCanvasFormat();
};

/**
 * Checks if WebGPU is supported and returns detailed information
 * @returns Promise that resolves to an object with WebGPU support information
 */
export const getWebGPUSupportInfo = async (): Promise<{
  supported: boolean;
  reason?: string;
  adapterInfo?: GPUAdapterInfo;
  features?: string[];
  limits?: Record<string, number>;
  preferredCanvasFormat?: GPUTextureFormat;
}> => {
  if (!navigator.gpu) {
    return {
      supported: false,
      reason: 'WebGPU is not supported in this browser',
    };
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      return {
        supported: false,
        reason: 'No WebGPU adapter found',
      };
    }

    const adapterInfo = await adapter.requestAdapterInfo();
    const features = Array.from(adapter.features).map(feature =>
      feature.toString(),
    );
    const limits: Record<string, number> = {};

    // Get all limits
    for (const key in adapter.limits) {
      const limitKey = key as keyof GPUSupportedLimits;
      limits[key] = adapter.limits[limitKey];
    }

    // Try to create a device to make sure it works
    try {
      const device = await adapter.requestDevice();

      return {
        supported: true,
        adapterInfo,
        features,
        limits,
        preferredCanvasFormat: navigator.gpu.getPreferredCanvasFormat(),
      };
    } catch (e) {
      return {
        supported: false,
        reason: `Failed to create WebGPU device: ${e instanceof Error ? e.message : String(e)}`,
        adapterInfo,
        features,
        limits,
      };
    }
  } catch (e) {
    return {
      supported: false,
      reason: `Error detecting WebGPU: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
};
