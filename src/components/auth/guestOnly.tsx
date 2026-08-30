import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import * as ROUTERS from "@constants/routers";

interface GuestOnlyProps {
  children: ReactNode;
}

/**
 * 이미 로그인한 상태로 접근하면 대시보드로 리다이렉트합니다.
 */
export default function GuestOnly({ children }: GuestOnlyProps) {
  const isAuthenticated = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTERS.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
