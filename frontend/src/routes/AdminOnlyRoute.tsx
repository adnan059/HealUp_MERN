import { useAuth } from "@/provider/auth-context";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AdminOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) {
    return <Navigate to={"/login"} />;
  }
  const isAllowed = user?.roles?.includes("admin");

  if (!isAllowed) {
    return <Navigate to={"/"} />;
  }

  return children;
};

export default AdminOnlyRoute;
