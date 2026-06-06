import axios from "axios";
import { mockApi, demoUserIdFromToken } from "./mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const TOKEN_KEY = "cbdc_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function currentUserId() {
  return demoUserIdFromToken(getToken());
}

// Each method either calls the mock backend (demo mode) or the real API.
export const api = {
  async register(payload) {
    if (DEMO_MODE) return mockApi.register(payload);
    const { data } = await client.post("/auth/register", payload);
    return data;
  },

  async login(payload) {
    if (DEMO_MODE) return mockApi.login(payload);
    const { data } = await client.post("/auth/login", payload);
    return data;
  },

  async getProfile() {
    if (DEMO_MODE) return mockApi.getProfile(currentUserId());
    const { data } = await client.get("/user/profile");
    return data;
  },

  async transfer(payload) {
    if (DEMO_MODE) return mockApi.transfer(currentUserId(), payload);
    const { data } = await client.post("/user/transfer", payload);
    return data;
  },

  async getTransactions() {
    if (DEMO_MODE) return mockApi.getTransactions(currentUserId());
    const { data } = await client.get("/transactions/history");
    return data;
  },

  async submitKyc(payload) {
    if (DEMO_MODE) return mockApi.submitKyc(currentUserId());
    const { data } = await client.post("/kyc/submit", payload);
    return data;
  },

  async getKycStatus() {
    if (DEMO_MODE) {
      const profile = await mockApi.getProfile(currentUserId());
      return { kycStatus: profile.kycStatus };
    }
    const { data } = await client.get("/kyc/status");
    return data;
  },

  async mint(payload) {
    if (DEMO_MODE) return mockApi.mint(currentUserId(), payload);
    const { data } = await client.post("/admin/mint", payload);
    return data;
  },

  async burn(payload) {
    if (DEMO_MODE) return mockApi.burn(currentUserId(), payload);
    const { data } = await client.post("/admin/burn", payload);
    return data;
  },

  async getAdminStats() {
    if (DEMO_MODE) return mockApi.getAdminStats();
    const { data } = await client.get("/admin/stats");
    return data;
  },
};

export function extractError(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    "Something went wrong. Please try again."
  );
}
