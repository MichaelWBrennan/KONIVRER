/**
 * WebGPU type declarations
 * These declarations extend the standard WebGPU types with additional properties
 * that may not be in the official spec yet but are useful for our application.
 */

// Extend the Navigator interface to include the gpu property
interface Navigator {
  gpu: GPU;
}

// Extend the GPU interface with additional methods
interface GPU {
  requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
  getPreferredCanvasFormat(): GPUTextureFormat;
  wgslLanguageFeatures?: Set<string>;
}

// Extend the GPUAdapter interface with additional properties
interface GPUAdapter {
  requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
  requestAdapterInfo(options?: GPURequestAdapterInfoOptions): Promise<GPUAdapterInfo>;
  features: Set<GPUFeatureName>;
  limits: GPUSupportedLimits;
  isFallbackAdapter?: boolean;
}

// Extend the GPUDevice interface with additional methods
interface GPUDevice extends GPUObjectBase {
  features: Set<GPUFeatureName>;
  limits: GPUSupportedLimits;
  queue: GPUQueue;
  destroy(): void;
  createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
  createTexture(descriptor: GPUTextureDescriptor): GPUTexture;
  createSampler(descriptor?: GPUSamplerDescriptor): GPUSampler;
  createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout;
  createPipelineLayout(descriptor: GPUPipelineLayoutDescriptor): GPUPipelineLayout;
  createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup;
  createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
  createComputePipeline(descriptor: GPUComputePipelineDescriptor): GPUComputePipeline;
  createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
  createCommandEncoder(descriptor?: GPUCommandEncoderDescriptor): GPUCommandEncoder;
  createRenderBundleEncoder(descriptor: GPURenderBundleEncoderDescriptor): GPURenderBundleEncoder;
  createQuerySet(descriptor: GPUQuerySetDescriptor): GPUQuerySet;
  pushErrorScope(filter: GPUErrorFilter): void;
  popErrorScope(): Promise<GPUError | null>;
  lost: Promise<GPUDeviceLostInfo>;
  onuncapturederror?: (event: GPUUncapturedErrorEvent) => void;
}

// Extend the GPUBuffer interface with additional methods
interface GPUBuffer extends GPUObjectBase {
  size: number;
  usage: GPUBufferUsageFlags;
  mapAsync(mode: GPUMapModeFlags, offset?: number, size?: number): Promise<void>;
  getMappedRange(offset?: number, size?: number): ArrayBuffer;
  unmap(): void;
  destroy(): void;
}

// Extend the GPUTexture interface with additional methods
interface GPUTexture extends GPUObjectBase {
  createView(descriptor?: GPUTextureViewDescriptor): GPUTextureView;
  destroy(): void;
  width: number;
  height: number;
  depthOrArrayLayers: number;
  mipLevelCount: number;
  sampleCount: number;
  dimension: GPUTextureDimension;
  format: GPUTextureFormat;
  usage: GPUTextureUsageFlags;
}

// Extend the GPUShaderModule interface with additional methods
interface GPUShaderModule extends GPUObjectBase {
  getCompilationInfo(): Promise<GPUCompilationInfo>;
}

// Extend the GPUCanvasContext interface with additional methods
interface GPUCanvasContext {
  canvas: HTMLCanvasElement;
  configure(configuration: GPUCanvasConfiguration): void;
  unconfigure(): void;
  getCurrentTexture(): GPUTexture;
}

// Extend the GPUCompilationMessage interface with additional properties
interface GPUCompilationMessage {
  message: string;
  type: GPUCompilationMessageType;
  lineNum: number;
  linePos: number;
  offset: number;
  length: number;
}

// Extend the GPUCompilationInfo interface with additional properties
interface GPUCompilationInfo {
  messages: GPUCompilationMessage[];
}

// Extend the GPUBindGroup interface with additional properties
interface GPUBindGroup extends GPUObjectBase {
  label?: string;
}

// Extend the GPUBindGroupLayout interface with additional properties
interface GPUBindGroupLayout extends GPUObjectBase {
  label?: string;
}

// Extend the GPUPipelineLayout interface with additional properties
interface GPUPipelineLayout extends GPUObjectBase {
  label?: string;
}

// Extend the GPURenderPipeline interface with additional properties
interface GPURenderPipeline extends GPUObjectBase {
  label?: string;
  getBindGroupLayout(index: number): GPUBindGroupLayout;
}

// Extend the GPUComputePipeline interface with additional properties
interface GPUComputePipeline extends GPUObjectBase {
  label?: string;
  getBindGroupLayout(index: number): GPUBindGroupLayout;
}

// Extend the GPUCommandEncoder interface with additional methods
interface GPUCommandEncoder extends GPUObjectBase {
  beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder;
  beginComputePass(descriptor?: GPUComputePassDescriptor): GPUComputePassEncoder;
  copyBufferToBuffer(
    source: GPUBuffer,
    sourceOffset: number,
    destination: GPUBuffer,
    destinationOffset: number,
    size: number
  ): void;
  copyBufferToTexture(
    source: GPUImageCopyBuffer,
    destination: GPUImageCopyTexture,
    copySize: GPUExtent3D
  ): void;
  copyTextureToBuffer(
    source: GPUImageCopyTexture,
    destination: GPUImageCopyBuffer,
    copySize: GPUExtent3D
  ): void;
  copyTextureToTexture(
    source: GPUImageCopyTexture,
    destination: GPUImageCopyTexture,
    copySize: GPUExtent3D
  ): void;
  clearBuffer(
    buffer: GPUBuffer,
    offset?: number,
    size?: number
  ): void;
  resolveQuerySet(
    querySet: GPUQuerySet,
    firstQuery: number,
    queryCount: number,
    destination: GPUBuffer,
    destinationOffset: number
  ): void;
  finish(descriptor?: GPUCommandBufferDescriptor): GPUCommandBuffer;
}

// Extend the GPURenderPassEncoder interface with additional methods
interface GPURenderPassEncoder extends GPUObjectBase {
  setPipeline(pipeline: GPURenderPipeline): void;
  setBindGroup(
    index: number,
    bindGroup: GPUBindGroup,
    dynamicOffsets?: number[] | Uint32Array,
    dynamicOffsetsDataStart?: number,
    dynamicOffsetsDataLength?: number
  ): void;
  setVertexBuffer(
    slot: number,
    buffer: GPUBuffer,
    offset?: number,
    size?: number
  ): void;
  setIndexBuffer(
    buffer: GPUBuffer,
    indexFormat: GPUIndexFormat,
    offset?: number,
    size?: number
  ): void;
  draw(
    vertexCount: number,
    instanceCount?: number,
    firstVertex?: number,
    firstInstance?: number
  ): void;
  drawIndexed(
    indexCount: number,
    instanceCount?: number,
    firstIndex?: number,
    baseVertex?: number,
    firstInstance?: number
  ): void;
  drawIndirect(
    indirectBuffer: GPUBuffer,
    indirectOffset: number
  ): void;
  drawIndexedIndirect(
    indirectBuffer: GPUBuffer,
    indirectOffset: number
  ): void;
  setViewport(
    x: number,
    y: number,
    width: number,
    height: number,
    minDepth: number,
    maxDepth: number
  ): void;
  setScissorRect(
    x: number,
    y: number,
    width: number,
    height: number
  ): void;
  setBlendConstant(color: GPUColor): void;
  setStencilReference(reference: number): void;
  beginOcclusionQuery(queryIndex: number): void;
  endOcclusionQuery(): void;
  beginPipelineStatisticsQuery(
    querySet: GPUQuerySet,
    queryIndex: number
  ): void;
  endPipelineStatisticsQuery(): void;
  writeTimestamp(
    querySet: GPUQuerySet,
    queryIndex: number
  ): void;
  executeBundles(bundles: GPURenderBundle[]): void;
  end(): void;
}

// Extend the GPUComputePassEncoder interface with additional methods
interface GPUComputePassEncoder extends GPUObjectBase {
  setPipeline(pipeline: GPUComputePipeline): void;
  setBindGroup(
    index: number,
    bindGroup: GPUBindGroup,
    dynamicOffsets?: number[] | Uint32Array,
    dynamicOffsetsDataStart?: number,
    dynamicOffsetsDataLength?: number
  ): void;
  dispatchWorkgroups(
    workgroupCountX: number,
    workgroupCountY?: number,
    workgroupCountZ?: number
  ): void;
  dispatchWorkgroupsIndirect(
    indirectBuffer: GPUBuffer,
    indirectOffset: number
  ): void;
  end(): void;
}

// Extend the GPUQueue interface with additional methods
interface GPUQueue extends GPUObjectBase {
  submit(commandBuffers: GPUCommandBuffer[]): void;
  onSubmittedWorkDone(): Promise<void>;
  writeBuffer(
    buffer: GPUBuffer,
    bufferOffset: number,
    data: BufferSource,
    dataOffset?: number,
    size?: number
  ): void;
  writeTexture(
    destination: GPUImageCopyTexture,
    data: BufferSource,
    dataLayout: GPUImageDataLayout,
    size: GPUExtent3D
  ): void;
  copyExternalImageToTexture(
    source: GPUImageCopyExternalImage,
    destination: GPUImageCopyTextureTagged,
    copySize: GPUExtent3D
  ): void;
}

// Extend the HTMLCanvasElement interface to include getContext for WebGPU
interface HTMLCanvasElement {
  getContext(contextId: "webgpu"): GPUCanvasContext | null;
}

// Declare additional WebGPU types that might not be in the standard declarations

// WebGPU feature names
type GPUFeatureName =
  | 'depth-clip-control'
  | 'depth32float-stencil8'
  | 'texture-compression-bc'
  | 'texture-compression-etc2'
  | 'texture-compression-astc'
  | 'timestamp-query'
  | 'indirect-first-instance'
  | 'shader-f16'
  | 'rg11b10ufloat-renderable'
  | 'bgra8unorm-storage'
  | 'float32-filterable'
  | string;

// WebGPU error filter
type GPUErrorFilter = 'out-of-memory' | 'validation';

// WebGPU compilation message type
type GPUCompilationMessageType = 'error' | 'warning' | 'info';

// WebGPU texture dimension
type GPUTextureDimension = '1d' | '2d' | '3d';

// WebGPU index format
type GPUIndexFormat = 'uint16' | 'uint32';

// WebGPU compare function
type GPUCompareFunction = 'never' | 'less' | 'equal' | 'less-equal' | 'greater' | 'not-equal' | 'greater-equal' | 'always';

// WebGPU texture format
type GPUTextureFormat =
  // 8-bit formats
  | 'r8unorm'
  | 'r8snorm'
  | 'r8uint'
  | 'r8sint'
  // 16-bit formats
  | 'r16uint'
  | 'r16sint'
  | 'r16float'
  | 'rg8unorm'
  | 'rg8snorm'
  | 'rg8uint'
  | 'rg8sint'
  // 32-bit formats
  | 'r32uint'
  | 'r32sint'
  | 'r32float'
  | 'rg16uint'
  | 'rg16sint'
  | 'rg16float'
  | 'rgba8unorm'
  | 'rgba8unorm-srgb'
  | 'rgba8snorm'
  | 'rgba8uint'
  | 'rgba8sint'
  | 'bgra8unorm'
  | 'bgra8unorm-srgb'
  // Packed 32-bit formats
  | 'rgb9e5ufloat'
  | 'rgb10a2unorm'
  | 'rg11b10ufloat'
  // 64-bit formats
  | 'rg32uint'
  | 'rg32sint'
  | 'rg32float'
  | 'rgba16uint'
  | 'rgba16sint'
  | 'rgba16float'
  // 128-bit formats
  | 'rgba32uint'
  | 'rgba32sint'
  | 'rgba32float'
  // Depth/stencil formats
  | 'stencil8'
  | 'depth16unorm'
  | 'depth24plus'
  | 'depth24plus-stencil8'
  | 'depth32float'
  | 'depth32float-stencil8'
  // BC compressed formats
  | 'bc1-rgba-unorm'
  | 'bc1-rgba-unorm-srgb'
  | 'bc2-rgba-unorm'
  | 'bc2-rgba-unorm-srgb'
  | 'bc3-rgba-unorm'
  | 'bc3-rgba-unorm-srgb'
  | 'bc4-r-unorm'
  | 'bc4-r-snorm'
  | 'bc5-rg-unorm'
  | 'bc5-rg-snorm'
  | 'bc6h-rgb-ufloat'
  | 'bc6h-rgb-float'
  | 'bc7-rgba-unorm'
  | 'bc7-rgba-unorm-srgb'
  // ETC2 compressed formats
  | 'etc2-rgb8unorm'
  | 'etc2-rgb8unorm-srgb'
  | 'etc2-rgb8a1unorm'
  | 'etc2-rgb8a1unorm-srgb'
  | 'etc2-rgba8unorm'
  | 'etc2-rgba8unorm-srgb'
  | 'eac-r11unorm'
  | 'eac-r11snorm'
  | 'eac-rg11unorm'
  | 'eac-rg11snorm'
  // ASTC compressed formats
  | 'astc-4x4-unorm'
  | 'astc-4x4-unorm-srgb'
  | 'astc-5x4-unorm'
  | 'astc-5x4-unorm-srgb'
  | 'astc-5x5-unorm'
  | 'astc-5x5-unorm-srgb'
  | 'astc-6x5-unorm'
  | 'astc-6x5-unorm-srgb'
  | 'astc-6x6-unorm'
  | 'astc-6x6-unorm-srgb'
  | 'astc-8x5-unorm'
  | 'astc-8x5-unorm-srgb'
  | 'astc-8x6-unorm'
  | 'astc-8x6-unorm-srgb'
  | 'astc-8x8-unorm'
  | 'astc-8x8-unorm-srgb'
  | 'astc-10x5-unorm'
  | 'astc-10x5-unorm-srgb'
  | 'astc-10x6-unorm'
  | 'astc-10x6-unorm-srgb'
  | 'astc-10x8-unorm'
  | 'astc-10x8-unorm-srgb'
  | 'astc-10x10-unorm'
  | 'astc-10x10-unorm-srgb'
  | 'astc-12x10-unorm'
  | 'astc-12x10-unorm-srgb'
  | 'astc-12x12-unorm'
  | 'astc-12x12-unorm-srgb';

// WebGPU buffer usage flags
type GPUBufferUsageFlags = number;
declare const GPUBufferUsage: {
  MAP_READ: 0x0001;
  MAP_WRITE: 0x0002;
  COPY_SRC: 0x0004;
  COPY_DST: 0x0008;
  INDEX: 0x0010;
  VERTEX: 0x0020;
  UNIFORM: 0x0040;
  STORAGE: 0x0080;
  INDIRECT: 0x0100;
  QUERY_RESOLVE: 0x0200;
};

// WebGPU texture usage flags
type GPUTextureUsageFlags = number;
declare const GPUTextureUsage: {
  COPY_SRC: 0x01;
  COPY_DST: 0x02;
  TEXTURE_BINDING: 0x04;
  STORAGE_BINDING: 0x08;
  RENDER_ATTACHMENT: 0x10;
};

// WebGPU shader stage flags
type GPUShaderStageFlags = number;
declare const GPUShaderStage: {
  VERTEX: 0x1;
  FRAGMENT: 0x2;
  COMPUTE: 0x4;
};

// WebGPU map mode flags
type GPUMapModeFlags = number;
declare const GPUMapMode: {
  READ: 0x0001;
  WRITE: 0x0002;
};

// WebGPU color write flags
type GPUColorWriteFlags = number;
declare const GPUColorWrite: {
  RED: 0x1;
  GREEN: 0x2;
  BLUE: 0x4;
  ALPHA: 0x8;
  ALL: 0xF;
};

// Declare additional WebGPU interfaces

interface GPUObjectBase {
  label: string;
}

interface GPUObjectDescriptorBase {
  label?: string;
}

interface GPUBufferDescriptor extends GPUObjectDescriptorBase {
  size: number;
  usage: GPUBufferUsageFlags;
  mappedAtCreation?: boolean;
}

interface GPUTextureDescriptor extends GPUObjectDescriptorBase {
  size: GPUExtent3D;
  mipLevelCount?: number;
  sampleCount?: number;
  dimension?: GPUTextureDimension;
  format: GPUTextureFormat;
  usage: GPUTextureUsageFlags;
  viewFormats?: GPUTextureFormat[];
}

interface GPUTextureViewDescriptor extends GPUObjectDescriptorBase {
  format?: GPUTextureFormat;
  dimension?: GPUTextureViewDimension;
  aspect?: GPUTextureAspect;
  baseMipLevel?: number;
  mipLevelCount?: number;
  baseArrayLayer?: number;
  arrayLayerCount?: number;
}

interface GPUSamplerDescriptor extends GPUObjectDescriptorBase {
  addressModeU?: GPUAddressMode;
  addressModeV?: GPUAddressMode;
  addressModeW?: GPUAddressMode;
  magFilter?: GPUFilterMode;
  minFilter?: GPUFilterMode;
  mipmapFilter?: GPUMipmapFilterMode;
  lodMinClamp?: number;
  lodMaxClamp?: number;
  compare?: GPUCompareFunction;
  maxAnisotropy?: number;
}

interface GPUBindGroupLayoutDescriptor extends GPUObjectDescriptorBase {
  entries: GPUBindGroupLayoutEntry[];
}

interface GPUBindGroupLayoutEntry {
  binding: number;
  visibility: GPUShaderStageFlags;
  buffer?: GPUBufferBindingLayout;
  sampler?: GPUSamplerBindingLayout;
  texture?: GPUTextureBindingLayout;
  storageTexture?: GPUStorageTextureBindingLayout;
  externalTexture?: GPUExternalTextureBindingLayout;
}

interface GPUBufferBindingLayout {
  type?: GPUBufferBindingType;
  hasDynamicOffset?: boolean;
  minBindingSize?: number;
}

interface GPUSamplerBindingLayout {
  type?: GPUSamplerBindingType;
}

interface GPUTextureBindingLayout {
  sampleType?: GPUTextureSampleType;
  viewDimension?: GPUTextureViewDimension;
  multisampled?: boolean;
}

interface GPUStorageTextureBindingLayout {
  access?: GPUStorageTextureAccess;
  format: GPUTextureFormat;
  viewDimension?: GPUTextureViewDimension;
}

interface GPUExternalTextureBindingLayout {
}

interface GPUBindGroupDescriptor extends GPUObjectDescriptorBase {
  layout: GPUBindGroupLayout;
  entries: GPUBindGroupEntry[];
}

interface GPUBindGroupEntry {
  binding: number;
  resource: GPUBindingResource;
}

type GPUBindingResource = GPUSampler | GPUTextureView | GPUBufferBinding | GPUExternalTexture;

interface GPUBufferBinding {
  buffer: GPUBuffer;
  offset?: number;
  size?: number;
}

interface GPUPipelineLayoutDescriptor extends GPUObjectDescriptorBase {
  bindGroupLayouts: GPUBindGroupLayout[];
}

interface GPUShaderModuleDescriptor extends GPUObjectDescriptorBase {
  code: string;
  sourceMap?: object;
}

interface GPUComputePipelineDescriptor extends GPUObjectDescriptorBase {
  layout: GPUPipelineLayout | 'auto';
  compute: GPUProgrammableStage;
}

interface GPURenderPipelineDescriptor extends GPUObjectDescriptorBase {
  layout: GPUPipelineLayout | 'auto';
  vertex: GPUVertexState;
  primitive?: GPUPrimitiveState;
  depthStencil?: GPUDepthStencilState;
  multisample?: GPUMultisampleState;
  fragment?: GPUFragmentState;
}

interface GPUProgrammableStage {
  module: GPUShaderModule;
  entryPoint: string;
  constants?: Record<string, number>;
}

interface GPUVertexState extends GPUProgrammableStage {
  buffers?: GPUVertexBufferLayout[];
}

interface GPUFragmentState extends GPUProgrammableStage {
  targets: GPUColorTargetState[];
}

interface GPUVertexBufferLayout {
  arrayStride: number;
  stepMode?: GPUVertexStepMode;
  attributes: GPUVertexAttribute[];
}

interface GPUVertexAttribute {
  format: GPUVertexFormat;
  offset: number;
  shaderLocation: number;
}

interface GPUColorTargetState {
  format: GPUTextureFormat;
  blend?: GPUBlendState;
  writeMask?: GPUColorWriteFlags;
}

interface GPUBlendState {
  color: GPUBlendComponent;
  alpha: GPUBlendComponent;
}

interface GPUBlendComponent {
  operation?: GPUBlendOperation;
  srcFactor?: GPUBlendFactor;
  dstFactor?: GPUBlendFactor;
}

interface GPUPrimitiveState {
  topology?: GPUPrimitiveTopology;
  stripIndexFormat?: GPUIndexFormat;
  frontFace?: GPUFrontFace;
  cullMode?: GPUCullMode;
  unclippedDepth?: boolean;
}

interface GPUDepthStencilState {
  format: GPUTextureFormat;
  depthWriteEnabled?: boolean;
  depthCompare?: GPUCompareFunction;
  stencilFront?: GPUStencilFaceState;
  stencilBack?: GPUStencilFaceState;
  stencilReadMask?: number;
  stencilWriteMask?: number;
  depthBias?: number;
  depthBiasSlopeScale?: number;
  depthBiasClamp?: number;
}

interface GPUStencilFaceState {
  compare?: GPUCompareFunction;
  failOp?: GPUStencilOperation;
  depthFailOp?: GPUStencilOperation;
  passOp?: GPUStencilOperation;
}

interface GPUMultisampleState {
  count?: number;
  mask?: number;
  alphaToCoverageEnabled?: boolean;
}

interface GPUCommandEncoderDescriptor extends GPUObjectDescriptorBase {
}

interface GPUCommandBufferDescriptor extends GPUObjectDescriptorBase {
}

interface GPURenderPassDescriptor extends GPUObjectDescriptorBase {
  colorAttachments: GPURenderPassColorAttachment[];
  depthStencilAttachment?: GPURenderPassDepthStencilAttachment;
  occlusionQuerySet?: GPUQuerySet;
  timestampWrites?: GPURenderPassTimestampWrites;
}

interface GPURenderPassColorAttachment {
  view: GPUTextureView;
  resolveTarget?: GPUTextureView;
  clearValue?: GPUColor;
  loadOp: GPULoadOp;
  storeOp: GPUStoreOp;
}

interface GPURenderPassDepthStencilAttachment {
  view: GPUTextureView;
  depthClearValue?: number;
  depthLoadOp?: GPULoadOp;
  depthStoreOp?: GPUStoreOp;
  depthReadOnly?: boolean;
  stencilClearValue?: number;
  stencilLoadOp?: GPULoadOp;
  stencilStoreOp?: GPUStoreOp;
  stencilReadOnly?: boolean;
}

interface GPURenderPassTimestampWrites {
  querySet: GPUQuerySet;
  beginningOfPassWriteIndex?: number;
  endOfPassWriteIndex?: number;
}

interface GPUComputePassDescriptor extends GPUObjectDescriptorBase {
  timestampWrites?: GPUComputePassTimestampWrites;
}

interface GPUComputePassTimestampWrites {
  querySet: GPUQuerySet;
  beginningOfPassWriteIndex?: number;
  endOfPassWriteIndex?: number;
}

interface GPURenderBundleEncoderDescriptor extends GPUObjectDescriptorBase {
  colorFormats: GPUTextureFormat[];
  depthStencilFormat?: GPUTextureFormat;
  sampleCount?: number;
  depthReadOnly?: boolean;
  stencilReadOnly?: boolean;
}

interface GPUQuerySetDescriptor extends GPUObjectDescriptorBase {
  type: GPUQueryType;
  count: number;
}

interface GPUDeviceLostInfo {
  readonly reason: GPUDeviceLostReason;
  readonly message: string;
}

interface GPUError {
  readonly message: string;
}

interface GPUOutOfMemoryError extends GPUError {
}

interface GPUValidationError extends GPUError {
}

interface GPUUncapturedErrorEvent extends Event {
  readonly error: GPUError;
}

interface GPURequestAdapterOptions {
  powerPreference?: GPUPowerPreference;
  forceFallbackAdapter?: boolean;
}

interface GPURequestAdapterInfoOptions {
  unmaskHint?: boolean;
}

interface GPUDeviceDescriptor {
  requiredFeatures?: GPUFeatureName[];
  requiredLimits?: Record<string, number>;
}

interface GPUAdapterInfo {
  vendor: string;
  architecture: string;
  device: string;
  description: string;
}

interface GPUSupportedLimits {
  maxTextureDimension1D?: number;
  maxTextureDimension2D?: number;
  maxTextureDimension3D?: number;
  maxTextureArrayLayers?: number;
  maxBindGroups?: number;
  maxBindingsPerBindGroup?: number;
  maxDynamicUniformBuffersPerPipelineLayout?: number;
  maxDynamicStorageBuffersPerPipelineLayout?: number;
  maxSampledTexturesPerShaderStage?: number;
  maxSamplersPerShaderStage?: number;
  maxStorageBuffersPerShaderStage?: number;
  maxStorageTexturesPerShaderStage?: number;
  maxUniformBuffersPerShaderStage?: number;
  maxUniformBufferBindingSize?: number;
  maxStorageBufferBindingSize?: number;
  minUniformBufferOffsetAlignment?: number;
  minStorageBufferOffsetAlignment?: number;
  maxVertexBuffers?: number;
  maxBufferSize?: number;
  maxVertexAttributes?: number;
  maxVertexBufferArrayStride?: number;
  maxInterStageShaderComponents?: number;
  maxInterStageShaderVariables?: number;
  maxColorAttachments?: number;
  maxColorAttachmentBytesPerSample?: number;
  maxComputeWorkgroupStorageSize?: number;
  maxComputeInvocationsPerWorkgroup?: number;
  maxComputeWorkgroupSizeX?: number;
  maxComputeWorkgroupSizeY?: number;
  maxComputeWorkgroupSizeZ?: number;
  maxComputeWorkgroupsPerDimension?: number;
}

interface GPURequiredLimits {
  maxTextureDimension1D?: number;
  maxTextureDimension2D?: number;
  maxTextureDimension3D?: number;
  maxTextureArrayLayers?: number;
  maxBindGroups?: number;
  maxBindingsPerBindGroup?: number;
  maxDynamicUniformBuffersPerPipelineLayout?: number;
  maxDynamicStorageBuffersPerPipelineLayout?: number;
  maxSampledTexturesPerShaderStage?: number;
  maxSamplersPerShaderStage?: number;
  maxStorageBuffersPerShaderStage?: number;
  maxStorageTexturesPerShaderStage?: number;
  maxUniformBuffersPerShaderStage?: number;
  maxUniformBufferBindingSize?: number;
  maxStorageBufferBindingSize?: number;
  minUniformBufferOffsetAlignment?: number;
  minStorageBufferOffsetAlignment?: number;
  maxVertexBuffers?: number;
  maxBufferSize?: number;
  maxVertexAttributes?: number;
  maxVertexBufferArrayStride?: number;
  maxInterStageShaderComponents?: number;
  maxInterStageShaderVariables?: number;
  maxColorAttachments?: number;
  maxColorAttachmentBytesPerSample?: number;
  maxComputeWorkgroupStorageSize?: number;
  maxComputeInvocationsPerWorkgroup?: number;
  maxComputeWorkgroupSizeX?: number;
  maxComputeWorkgroupSizeY?: number;
  maxComputeWorkgroupSizeZ?: number;
  maxComputeWorkgroupsPerDimension?: number;
}

interface GPUExtent3D {
  width: number;
  height?: number;
  depthOrArrayLayers?: number;
}

interface GPUCanvasConfiguration {
  device: GPUDevice;
  format: GPUTextureFormat;
  usage?: GPUTextureUsageFlags;
  viewFormats?: GPUTextureFormat[];
  colorSpace?: PredefinedColorSpace;
  alphaMode?: GPUCanvasAlphaMode;
}

interface GPUImageCopyBuffer {
  buffer: GPUBuffer;
  offset?: number;
  bytesPerRow?: number;
  rowsPerImage?: number;
}

interface GPUImageCopyTexture {
  texture: GPUTexture;
  mipLevel?: number;
  origin?: GPUOrigin3D;
  aspect?: GPUTextureAspect;
}

interface GPUImageCopyTextureTagged extends GPUImageCopyTexture {
  colorSpace?: PredefinedColorSpace;
  premultipliedAlpha?: boolean;
}

interface GPUImageCopyExternalImage {
  source: ImageBitmap | HTMLCanvasElement | HTMLVideoElement | OffscreenCanvas;
  origin?: GPUOrigin2D;
  flipY?: boolean;
}

interface GPUImageDataLayout {
  offset?: number;
  bytesPerRow?: number;
  rowsPerImage?: number;
}

interface GPUOrigin2D {
  x?: number;
  y?: number;
}

interface GPUOrigin3D extends GPUOrigin2D {
  z?: number;
}

interface GPUColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

// WebGPU enums
type GPUBufferBindingType = 'uniform' | 'storage' | 'read-only-storage';
type GPUSamplerBindingType = 'filtering' | 'non-filtering' | 'comparison';
type GPUTextureSampleType = 'float' | 'unfilterable-float' | 'depth' | 'sint' | 'uint';
type GPUTextureViewDimension = '1d' | '2d' | '2d-array' | 'cube' | 'cube-array' | '3d';
type GPUTextureAspect = 'all' | 'stencil-only' | 'depth-only';
type GPUAddressMode = 'clamp-to-edge' | 'repeat' | 'mirror-repeat';
type GPUFilterMode = 'nearest' | 'linear';
type GPUMipmapFilterMode = 'nearest' | 'linear';
type GPUStorageTextureAccess = 'write-only' | 'read-only' | 'read-write';
type GPUVertexStepMode = 'vertex' | 'instance';
type GPUVertexFormat = 
  | 'uint8x2' | 'uint8x4'
  | 'sint8x2' | 'sint8x4'
  | 'unorm8x2' | 'unorm8x4'
  | 'snorm8x2' | 'snorm8x4'
  | 'uint16x2' | 'uint16x4'
  | 'sint16x2' | 'sint16x4'
  | 'unorm16x2' | 'unorm16x4'
  | 'snorm16x2' | 'snorm16x4'
  | 'float16x2' | 'float16x4'
  | 'float32' | 'float32x2' | 'float32x3' | 'float32x4'
  | 'uint32' | 'uint32x2' | 'uint32x3' | 'uint32x4'
  | 'sint32' | 'sint32x2' | 'sint32x3' | 'sint32x4';
type GPUBlendOperation = 'add' | 'subtract' | 'reverse-subtract' | 'min' | 'max';
type GPUBlendFactor = 
  | 'zero' | 'one'
  | 'src' | 'one-minus-src' | 'src-alpha' | 'one-minus-src-alpha'
  | 'dst' | 'one-minus-dst' | 'dst-alpha' | 'one-minus-dst-alpha'
  | 'src-alpha-saturated'
  | 'constant' | 'one-minus-constant';
type GPUPrimitiveTopology = 'point-list' | 'line-list' | 'line-strip' | 'triangle-list' | 'triangle-strip';
type GPUFrontFace = 'ccw' | 'cw';
type GPUCullMode = 'none' | 'front' | 'back';
type GPUStencilOperation = 'keep' | 'zero' | 'replace' | 'invert' | 'increment-clamp' | 'decrement-clamp' | 'increment-wrap' | 'decrement-wrap';
type GPULoadOp = 'load' | 'clear';
type GPUStoreOp = 'store' | 'discard';
type GPUQueryType = 'occlusion' | 'pipeline-statistics' | 'timestamp';
type GPUDeviceLostReason = 'destroyed';
type GPUPowerPreference = 'low-power' | 'high-performance';
type GPUCanvasAlphaMode = 'opaque' | 'premultiplied';