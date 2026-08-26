import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import * as ROUTERS from "@constants/routers";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <>
      <header>
        <div className='inner'>
          <div className='flex items-center gap-5'>
            <h1>KB Healthcare</h1>
            <Link to={ROUTERS.DASHBOARD}>대시보드</Link>
            <Link to={ROUTERS.TASK}>할 일</Link>
          </div>

          <Link className='icon_btn' to={ROUTERS.LOGIN}>
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </div>
      </header>

      <div className='inner'>{children}</div>
    </>
  );
}

export default Layout;
