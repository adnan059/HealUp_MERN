/* eslint-disable react-refresh/only-export-components */
import { api } from "@/lib/crud-utils";
import type { IUser } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/getCurrentUser");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // logout
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  useEffect(() => {
    const handleForceLogout = () => {
      logout();
      navigate("/login");
    };
    addEventListener("force-logout", handleForceLogout);

    return () => removeEventListener("force-logout", handleForceLogout);
  }, [logout, navigate]);

  const value: IAuthContext = {
    user,
    isAuthenticated: !!user,
    refetchUser: fetchUser,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth Must Be Used Within An AuthProvider");
  }
  return context;
};
