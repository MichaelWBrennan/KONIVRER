/**
 * Core Type Definitions for KONIVRER Deck Database
 * 
 * This file exports all type definitions used throughout the application.
 * All types are strictly typed and follow TypeScript best practices.
 * 
 * @version 2.0.0
 * @since 2024-07-06
 */

// Core domain types
export * from './card';
export * from './game';
export * from './api';
export * from './component';

// Additional core types
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface User extends BaseEntity {
  readonly email: string;
  readonly displayName: string;
  readonly avatar?: string;
  readonly isVerified: boolean;
  readonly preferences: UserPreferences;
}

export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'auto';
  readonly language: string;
  readonly notifications: NotificationSettings;
  readonly accessibility: AccessibilitySettings;
}

export interface NotificationSettings {
  readonly email: boolean;
  readonly push: boolean;
  readonly tournaments: boolean;
  readonly matches: boolean;
}

export interface AccessibilitySettings {
  readonly highContrast: boolean;
  readonly largeText: boolean;
  readonly screenReader: boolean;
  readonly reducedMotion: boolean;
}

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly timestamp: Date;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
  };
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Event types
export interface AppEvent<T = unknown> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: Date;
  readonly source: string;
}

// Error types
export interface AppError extends Error {
  readonly code: string;
  readonly context?: Record<string, unknown>;
  readonly timestamp: Date;
}

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export {};