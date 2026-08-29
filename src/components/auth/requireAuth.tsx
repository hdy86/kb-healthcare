import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import * as ROUTERS from "@constants/routers";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * 로그인하지 않은 상태로 접근하면 로그인 페이지로 리다이렉트합니다.
 */
export default function RequireAuth({ children }: RequireAuthProps) {
  const isAuthenticated = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTERS.LOGIN} replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
