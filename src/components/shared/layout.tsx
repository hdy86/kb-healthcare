import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faList, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import * as ROUTERS from "@constants/routers";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const pathname = useLocation().pathname;

  return (
    <>
      <header>
        <div className='inner'>
          <div className='flex items-center gap-5'>
            <h1>KB Healthcare</h1>
            <Link
              className={`flex items-center justify-center gap-2 ${pathname === ROUTERS.DASHBOARD ? "on" : ""}`}
              to={ROUTERS.DASHBOARD}
            >
              <FontAwesomeIcon icon={faHouse} size='lg' />
              <span>대시보드</span>
            </Link>
            <Link
              className={`flex items-center gap-2 ${pathname.includes(ROUTERS.TASK) ? "on" : ""}`}
              to={ROUTERS.TASK}
            >
              <FontAwesomeIcon icon={faList} size='lg' />
              <span>할 일</span>
            </Link>
          </div>

          <Link className='auth_btn' to={ROUTERS.LOGIN}>
            <FontAwesomeIcon
              icon={faRightToBracket}
              // icon={faUser}
              size='xl'
            />
          </Link>
        </div>
      </header>

      <section>
        <div className='inner'>{children}</div>
      </section>
    </>
  );
}

export default Layout;
