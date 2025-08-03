import '@testing-library/jest-dom';
import 'canvas';

// Mock DOM APIs that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock MutationObserver
global.MutationObserver = class MutationObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

// Mock navigator
Object.defineProperty(global, 'navigator', {
  writable: true,
  value: {
    userAgent: 'test-agent',
    serviceWorker: {
      register: () => Promise.resolve(),
      ready: Promise.resolve(),
    },
  },
});

Object.defineProperty(navigator, 'serviceWorker', {
  writable: true,
  value: {
    register: () => Promise.resolve(),
    ready: Promise.resolve(),
  },
});

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = function (contextId: string) {
  if (contextId === '2d') {
    return {
      fillText: () => {},
      measureText: () => ({ width: 0 }),
      getImageData: () => ({ data: new Uint8ClampedArray(4) }),
      canvas: this,
      textBaseline: 'top',
      font: '14px Arial',
    };
  }
  return null;
};

// Mock Performance API
Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
    getEntriesByName: () => [],
    getEntriesByType: () => [],
  },
});

// Mock document and window for tests that need them
Object.defineProperty(global, 'document', {
  writable: true,
  value: {
    createElement: (tagName: string) => ({
      tagName: tagName.toUpperCase(),
      id: '',
      className: '',
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild: () => {},
      removeChild: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
    }),
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    body: {
      appendChild: () => {},
      removeChild: () => {},
    },
  },
});
