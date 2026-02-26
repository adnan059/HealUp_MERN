import { useAuth } from "@/provider/auth-context";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) {
    return <Navigate to={"/"} replace />;
  }
  return children;
};

export default PublicOnlyRoute;
