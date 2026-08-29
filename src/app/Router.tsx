import { Route, Routes } from "react-router-dom";
import Dashboard from "@app/dashboard/page";
import Task from "@app/task/page";
import TaskDetail from "@app/task/detail/page";
import Login from "@app/auth/login/page";
import Mypage from "@app/auth/mypage/page";
import GuestOnly from "@components/auth/guestOnly";
import RequireAuth from "@components/auth/requireAuth";
import * as ROUTERS from "@constants/routers";

export default function Router() {
  return (
    <Routes>
      <Route path={ROUTERS.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTERS.TASK} element={<Task />} />
      <Route path={ROUTERS.TASK_DETAIL} element={<TaskDetail />} />
      <Route
        path={ROUTERS.LOGIN}
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path={ROUTERS.MYPAGE}
        element={
          <RequireAuth>
            <Mypage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
