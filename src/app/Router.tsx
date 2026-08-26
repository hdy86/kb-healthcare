import { Route, Routes } from "react-router-dom";
import Dashboard from "@app/dashboard/page";
import Task from "@app/task/page";
import TaskDetail from "@app/task/detail/page";
import Login from "@app/login/page";
import Mypage from "@app/mypage/page";
import * as ROUTERS from "@constants/routers";

function Router() {
  return (
    <Routes>
      <Route path={ROUTERS.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTERS.TASK} element={<Task />} />
      <Route path={ROUTERS.TASK_DETAIL} element={<TaskDetail />} />
      <Route path={ROUTERS.LOGIN} element={<Login />} />
      <Route path={ROUTERS.MYPAGE} element={<Mypage />} />
    </Routes>
  );
}

export default Router;
