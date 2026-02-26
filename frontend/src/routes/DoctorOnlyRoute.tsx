import { useAuth } from "@/provider/auth-context";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const DoctorOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }
  const isAllowed =
    user?.roles?.length === 2 &&
    user?.roles?.includes("patient") &&
    user?.roles?.includes("doctor");
  if (!isAllowed) {
    return <Navigate to={"/"} />;
  }
  return children;
};

export default DoctorOnlyRoute;
