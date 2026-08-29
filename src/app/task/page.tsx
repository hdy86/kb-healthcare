import { Link } from "react-router-dom";
import * as ROUTERS from "@constants/routers";

export default function Page() {
  return (
    <>
      <h2>할일 목록</h2>

      <ul className='task_list'>
        <li>
          <Link to={`${ROUTERS.TASK}/1`}>
            <p>할일 1</p>
            <span>몌모!</span>
          </Link>
        </li>
        <li>
          <Link to={`${ROUTERS.TASK}/1`}>
            <p>할일 1</p>
            <span>몌모!</span>
          </Link>
        </li>
        <li>
          <Link to={`${ROUTERS.TASK}/1`}>
            <p>할일 1</p>
            <span>몌모!</span>
          </Link>
        </li>
        <li>
          <Link to={`${ROUTERS.TASK}/1`}>
            <p>할일 1</p>
            <span>몌모!</span>
          </Link>
        </li>
      </ul>
    </>
  );
}
