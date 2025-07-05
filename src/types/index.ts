/**
 * KONIVRER Deck Database - Type Definitions Index
 *
 * Copyright (c) 2024 KONIVRER Deck Database
 * Licensed under the MIT License
 */

// Export all types from the type definition files
export * from './card';
export * from './game';
export * from './api';
export * from './component';

// Additional utility types

/**
 * Makes all properties in T optional and nullable
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null };

/**
 * Makes all properties in T required and non-nullable
 */
export type Required<T> = { [P in keyof T]-?: T[P] };

/**
 * Makes all properties in T readonly
 */
export type Immutable<T> = { readonly [P in keyof T]: T[P] };

/**
 * Extracts the type of an array element
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Creates a type with only the specified keys from T
 */
export type Pick<T, K extends keyof T> = { [P in K]: T[P] };

/**
 * Creates a type with all keys from T except those in K
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Creates a type with all properties of T set to optional
 */
export type Partial<T> = { [P in keyof T]?: T[P] };

/**
 * Creates a type that requires at least one of the keys in T
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys];

/**
 * Creates a type that allows only one of the keys in T
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys];

/**
 * Creates a type with all properties of T and U
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

/**
 * Creates a type with all properties of T deeply set to readonly
 */
export type DeepReadonly<T> =
  T extends (infer R)[] ? DeepReadonlyArray<R> :
  T extends Function ? T :
  T extends object ? DeepReadonlyObject<T> :
  T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};