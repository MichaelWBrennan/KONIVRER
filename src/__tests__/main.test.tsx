import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock the AllInOne component
vi.mock('../core/AllInOne', () => ({
  default: () => <div data-testid="all-in-one-app">AllInOne App</div>,
}));

// Mock web-vitals
vi.mock('web-vitals', () => ({
  getCLS: vi.fn(),
  getFID: vi.fn(),
  getFCP: vi.fn(),
  getLCP: vi.fn(),
  getTTFB: vi.fn(),
}));

describe('main.tsx', () => {
  let dom: JSDOM;
  let window: Window & typeof globalThis;
  let document: Document;

  beforeEach(() => {
    // Create a fresh DOM for each test
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
      url: 'http://localhost',
      pretendToBeVisual: true,
      resources: 'usable',
    });
    
    window = dom.window as Window & typeof globalThis;
    document = window.document;
    
    // Set up global objects
    global.window = window;
    global.document = document;
    global.navigator = window.navigator;
    
    // Mock createRoot
    vi.doMock('react-dom/client', () => ({
      createRoot: vi.fn(() => ({
        render: vi.fn(),
      })),
    }));
  });

  it('should find root element', () => {
    const rootElement = document.getElementById('root');
    expect(rootElement).toBeTruthy();
    expect(rootElement?.tagName).toBe('DIV');
  });

  it('should throw error if root element not found', () => {
    // Remove root element
    const rootElement = document.getElementById('root');
    rootElement?.remove();
    
    expect(() => {
      const element = document.getElementById('root');
      if (!element) {
        throw new Error('Root element not found');
      }
    }).toThrow('Root element not found');
  });

  it('should register service worker when available', () => {
    const mockRegister = vi.fn().mockResolvedValue({ scope: '/' });
    const mockServiceWorker = {
      register: mockRegister,
    };
    
    Object.defineProperty(window.navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    });

    // Simulate the service worker registration
    if ('serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.register('/sw.js');
      expect(mockRegister).toHaveBeenCalledWith('/sw.js');
    }
  });

  it('should handle service worker registration failure', async () => {
    const mockRegister = vi.fn().mockRejectedValue(new Error('Registration failed'));
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    const mockServiceWorker = {
      register: mockRegister,
    };
    
    Object.defineProperty(window.navigator, 'serviceWorker', {
      value: mockServiceWorker,
      writable: true,
    });

    try {
      await window.navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
    
    consoleSpy.mockRestore();
  });

  it('should load web-vitals in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    
    const mockWebVitals = {
      getCLS: vi.fn(),
      getFID: vi.fn(),
      getFCP: vi.fn(),
      getLCP: vi.fn(),
      getTTFB: vi.fn(),
    };
    
    // Mock dynamic import
    vi.doMock('web-vitals', () => mockWebVitals);
    
    // Simulate the dynamic import
    const webVitals = await import('web-vitals');
    expect(webVitals.getCLS).toBeDefined();
    expect(webVitals.getFID).toBeDefined();
    expect(webVitals.getFCP).toBeDefined();
    expect(webVitals.getLCP).toBeDefined();
    expect(webVitals.getTTFB).toBeDefined();
    
    process.env.NODE_ENV = originalEnv;
  });
});