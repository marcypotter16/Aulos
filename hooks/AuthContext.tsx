import { StorageUtils } from "@/app/StorageUtils";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const stored = await StorageUtils.getItem("access_token");
      if (stored) setToken(stored);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }).toString(),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Login failed");

      await StorageUtils.setItem("access_token", data.access_token);
      setToken(data.access_token);
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        error,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
