import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import type { Card } from "../types";

// API Configuration
const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL ||
  (import.meta as any).env.VITE_API_URL ||
  "/api/v1";

// Create axios instance with proper configuration
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      // Dispatch custom event for auth state change
      window.dispatchEvent(new CustomEvent("auth:logout"));
    }
    
    // Log error for debugging
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    
    return Promise.reject(error);
  }
);

// Card API endpoints with proper typing
export const cardApi = {
  getAll: (params?: Record<string, any>) => 
    api.get<{ cards: Card[]; total: number; page: number; limit: number }>("/cards", { params }),
  
  getById: (id: string) => 
    api.get<Card>(`/cards/${id}`),
  
  getByName: (name: string) => 
    api.get<Card>(`/cards/name/${encodeURIComponent(name)}`),
  
  create: (data: Partial<Card>) => 
    api.post<Card>("/cards", data),
  
  update: (id: string, data: Partial<Card>) => 
    api.put<Card>(`/cards/${id}`, data),
  
  delete: (id: string) => 
    api.delete<void>(`/cards/${id}`),
  
  bulkCreate: (data: Partial<Card>[]) => 
    api.post<{ created: number; errors: string[] }>("/cards/bulk", { cards: data }),
  
  getStatistics: () => 
    api.get<{
      totalCards: number;
      byRarity: Record<string, number>;
      byElement: Record<string, number>;
      byType: Record<string, number>;
    }>("/cards/statistics"),
  
  search: (query: string, filters?: Record<string, any>) =>
    api.get<{ cards: Card[]; total: number }>("/cards/search", {
      params: { q: query, ...filters }
    }),
};

// Deck API endpoints
export const deckApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ decks: any[]; total: number }>("/decks", { params }),
  
  getById: (id: string) =>
    api.get<any>(`/decks/${id}`),
  
  create: (data: any) =>
    api.post<any>("/decks", data),
  
  update: (id: string, data: any) =>
    api.put<any>(`/decks/${id}`, data),
  
  delete: (id: string) =>
    api.delete<void>(`/decks/${id}`),
  
  validate: (deckData: any) =>
    api.post<{ isValid: boolean; errors: string[] }>("/decks/validate", deckData),
};

// Migration API endpoints
export const migrationApi = {
  seedKonivrrerCards: () => 
    api.post<{ message: string; cardsCreated: number }>("/migration/seed-konivrer-cards"),
  
  resetDatabase: () =>
    api.post<{ message: string }>("/migration/reset"),
  
  getStatus: () =>
    api.get<{ status: string; lastMigration?: string }>("/migration/status"),
};

// User API endpoints
export const userApi = {
  getProfile: () =>
    api.get<any>("/users/profile"),
  
  updateProfile: (data: any) =>
    api.put<any>("/users/profile", data),
  
  getDecks: (userId: string) =>
    api.get<any[]>(`/users/${userId}/decks`),
};

// Event API endpoints
export const eventApi = {
  getAll: (params?: Record<string, any>) =>
    api.get<{ events: any[]; total: number }>("/events", { params }),
  
  getById: (id: string) =>
    api.get<any>(`/events/${id}`),
  
  create: (data: any) =>
    api.post<any>("/events", data),
  
  update: (id: string, data: any) =>
    api.put<any>(`/events/${id}`, data),
  
  delete: (id: string) =>
    api.delete<void>(`/events/${id}`),
  
  join: (eventId: string) =>
    api.post<{ message: string }>(`/events/${eventId}/join`),
  
  leave: (eventId: string) =>
    api.post<{ message: string }>(`/events/${eventId}/leave`),
};

export default api;