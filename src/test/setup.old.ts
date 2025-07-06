/**
 * KONIVRER Deck Database
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Test setup file for vitest
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = class IntersectionObserver {
  constructor(): any {
}
  disconnect(): any {}
  observe(): any {}
  unobserve(): any {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(): any {
}
  disconnect(): any {}
  observe(): any {}
  unobserve(): any {}
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});
