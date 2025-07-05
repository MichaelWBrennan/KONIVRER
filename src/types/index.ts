// Main type exports
export * from './card';
export * from './game';
export * from './api';
export * from './component';

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export {};