import { useAuth } from "@/provider/auth-context";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PatientOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  const isAllowed =
    user?.roles?.length === 1 && user?.roles?.includes("patient");

  if (!isAllowed) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};

export default PatientOnlyRoute;
