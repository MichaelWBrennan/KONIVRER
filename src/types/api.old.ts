import React from 'react';
// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    };
  }

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
}