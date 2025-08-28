import axios from "axios";

const API_BASE_URL: any : any : any =
  (import.meta as any).env.VITE_API_BASE_URL ||
  (import.meta as any).env.VITE_API_URL ||
  "/api";

export const api: any : any : any = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token: any : any : any = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      // optional: route to login
    }
    return Promise.reject(error);
  }
);

// Card API endpoints
export const cardApi: any : any : any = {
  getAll: (params?: any) => api.get("/cards", { params }),
  getById: (id: string) => api.get(`/cards/${id}`),
  getByName: (name: string) => api.get(`/cards/name/${name}`),
  create: (data: any) => api.post("/cards", data),
  update: (id: string, data: any) => api.put(`/cards/${id}`, data),
  delete: (id: string) => api.delete(`/cards/${id}`),
  bulkCreate: (data: any[] = [] = [] = [] = ([] = [] = [] = [])) =>
    api.post("/cards/bulk", data),
  getStatistics: () => api.get("/cards/statistics"),
};

// Migration API endpoints
export const migrationApi: any : any : any = {
  seedKonivrrerCards: () => api.post("/migration/seed-konivrer-cards"),
};

export default api;
