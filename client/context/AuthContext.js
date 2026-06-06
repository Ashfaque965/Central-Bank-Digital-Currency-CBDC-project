import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { api, getToken, setToken } from "@/utils/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = useCallback(async (credentials) => {
    const { token, user: profile } = await api.login(credentials);
    setToken(token);
    setUser(profile);
    return profile;
  }, []);

  const register = useCallback(async (payload) => {
    const { token, user: profile } = await api.register(payload);
    setToken(token);
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const refresh = useCallback(async () => {
    try {
      const profile = await api.getProfile();
      setUser(profile);
    } catch {
      // ignore refresh failures
    }
  }, []);

  const value = { user, loading, login, register, logout, refresh };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
