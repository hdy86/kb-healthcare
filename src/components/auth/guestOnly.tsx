import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import * as ROUTERS from "@constants/routers";

interface GuestOnlyProps {
  children: ReactNode;
}

/**
 * 이미 로그인한 상태로 접근하면 대시보드로 리다이렉트합니다.
 * 로그인 페이지처럼 "비로그인 사용자만" 볼 필요가 있는 페이지에 사용합니다.
 */
export default function GuestOnly({ children }: GuestOnlyProps) {
  const isAuthenticated = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTERS.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
