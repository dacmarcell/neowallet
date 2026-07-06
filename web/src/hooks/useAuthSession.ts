import { useEffect, useState } from "react";
import { api } from "../lib/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Session {
  user: User;
}

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const response = await api.get("/v1/auth/me");

      if (response.ok) {
        const data = await response.json();
        setSession({ user: data });
      } else {
        setSession(null);
      }
    } catch (error) {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/v1/auth/login", { email, password });

      if (response.ok) {
        await checkSession();
        return { success: true };
      }

      const error = await response.json();
      return { success: false, error };
    } catch (error) {
      return { success: false, error: "Erro ao fazer login" };
    }
  };

  const logout = async () => {
    try {
      await api.post("/v1/auth/logout");
      setSession(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return {
    session,
    user: session?.user ?? null,
    loading,
    login,
    logout,
    checkSession,
  };
}
