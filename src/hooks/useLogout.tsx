import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { clearSession } from "@api/client";
import * as ROUTERS from "@constants/routers";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    void clearSession();
    queryClient.clear();
    navigate(ROUTERS.LOGIN, { replace: true });
  };
}
