import { Link } from "react-router-dom";
import * as ROUTERS from "@constants/routers";
import { useDashboard } from "@api/hooks/useDashboard";
import Loading from "@components/shared/loading";

export default function Page() {
  // ==================== API ====================
  const { data, isLoading } = useDashboard();

  return (
    <>
      <h2>대시보드</h2>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <ul className='dashboard_list'>
            <li>
              <p>일</p>
              <span>{data?.numOfTask || 0}</span>
            </li>
            <li>
              <p>해야할 일</p>
              <span>{data?.numOfRestTask || 0}</span>
            </li>
            <li>
              <p>한 일</p>
              <span>{data?.numOfDoneTask || 0}</span>
            </li>
          </ul>

          <Link to={ROUTERS.TASK} className='btn mx-auto'>
            자세히 보기
          </Link>
        </>
      )}
    </>
  );
}
