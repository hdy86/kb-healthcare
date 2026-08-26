import { Link } from "react-router-dom";
import * as ROUTERS from "@constants/routers";

function Page() {
  return (
    <>
      <h2>대시보드</h2>

      <ul className='dashboard_list'>
        <li>
          <p>일</p>
          <span>12</span>
        </li>
        <li>
          <p>해야할 일</p>
          <span>7</span>
        </li>
        <li>
          <p>한 일</p>
          <span>5</span>
        </li>
      </ul>

      <Link to={ROUTERS.TASK} className='btn mx-auto'>
        자세히 보기
      </Link>
    </>
  );
}

export default Page;
