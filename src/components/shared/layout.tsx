import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faList, faRightToBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import * as ROUTERS from "@constants/routers";
import QueryProvider from "@api/provider";
import { useAuth } from "@hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  const isAuthenticated = useAuth();

  return (
    <QueryProvider>
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

          {isAuthenticated ? (
            <Link className='auth_btn' to={ROUTERS.MYPAGE}>
              <FontAwesomeIcon icon={faUser} size='xl' />
            </Link>
          ) : (
            <Link className='auth_btn' to={ROUTERS.LOGIN}>
              <FontAwesomeIcon icon={faRightToBracket} size='xl' />
            </Link>
          )}
        </div>
      </header>

      <section>
        <div className='inner'>{children}</div>
      </section>
    </QueryProvider>
  );
}
