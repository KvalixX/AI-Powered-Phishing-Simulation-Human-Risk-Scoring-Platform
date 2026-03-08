import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor – inject JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/#/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: { name: string; email: string; password: string; organization: string }) =>
    api.post("/auth/register", data),
  resetPassword: (email: string) =>
    api.post("/auth/reset-password", { email }),
  logout: () => api.post("/auth/logout"),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getMetrics: () => api.get("/dashboard/metrics"),
  getRiskTrend: () => api.get("/dashboard/risk-trend"),
  getRecentCampaigns: () => api.get("/dashboard/recent-campaigns"),
  getAiInsights: () => api.get("/dashboard/ai-insights"),
};

// ─── Campaigns ───────────────────────────────────────────────────────────────
export const campaignsApi = {
  getAll: (params?: { status?: string; search?: string }) =>
    api.get("/campaigns", { params }),
  getById: (id: number) => api.get(`/campaigns/${id}`),
  create: (data: object) => api.post("/campaigns", data),
  update: (id: number, data: object) => api.put(`/campaigns/${id}`, data),
  delete: (id: number) => api.delete(`/campaigns/${id}`),
  pause: (id: number) => api.post(`/campaigns/${id}/pause`),
  resume: (id: number) => api.post(`/campaigns/${id}/resume`),
  getPerformance: (id: number) => api.get(`/campaigns/${id}/performance`),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: (params?: { department?: string; riskLevel?: string; search?: string }) =>
    api.get("/users", { params }),
  getById: (id: number) => api.get(`/users/${id}`),
  getProfile: (id: number) => api.get(`/users/${id}/profile`),
  getRiskHistory: (id: number) => api.get(`/users/${id}/risk-history`),
  getCampaignHistory: (id: number) => api.get(`/users/${id}/campaigns`),
  assignTraining: (id: number, moduleId: number) =>
    api.post(`/users/${id}/training`, { moduleId }),
  create: (data: object) => api.post("/users", data),
  update: (id: number, data: object) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsApi = {
  getClickRateOverTime: () => api.get("/analytics/click-rate-trend"),
  getRiskDistribution: () => api.get("/analytics/risk-distribution"),
  getCampaignPerformance: () => api.get("/analytics/campaign-performance"),
  getBehaviorHeatmap: () => api.get("/analytics/behavior-heatmap"),
  getTrainingEffectiveness: () => api.get("/analytics/training-effectiveness"),
  getDepartmentRisk: () => api.get("/analytics/department-risk"),
};

// ─── Training ─────────────────────────────────────────────────────────────────
export const trainingApi = {
  getModules: () => api.get("/training/modules"),
  getAssigned: () => api.get("/training/assigned"),
  getLeaderboard: () => api.get("/training/leaderboard"),
  assignModule: (userId: number, moduleId: number) =>
    api.post("/training/assign", { userId, moduleId }),
  getProgress: (userId: number) => api.get(`/training/progress/${userId}`),
};

export default api;
