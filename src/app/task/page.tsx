import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as ROUTERS from "@constants/routers";
import { useTasks } from "@api/hooks/useTasks";
import Loading from "@components/shared/loading";

export default function Page() {
  const observerRef = useRef<HTMLLIElement | null>(null);

  // ==================== API ====================
  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useTasks();
  const tasks = data?.pages.flatMap((page) => page.data) ?? [];

  // 가상 스크롤
  useEffect(() => {
    const target = observerRef.current;

    if (!target) return;
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <h2>할일 목록</h2>

      {isLoading ? (
        <Loading />
      ) : (
        <ul className='task_list'>
          {tasks?.length > 0 ? (
            tasks?.map((item) => (
              <li key={item.id}>
                <Link to={`${ROUTERS.TASK}/${item.id}`}>
                  <p>{item.title || "-"}</p>
                  <span>{item.memo || "-"}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className='no_data'>
              <span>등록된 할일 목록이 없습니다.</span>
            </li>
          )}
          <li ref={observerRef} className='observer_area'>
            {isFetchingNextPage && <Loading />}
          </li>
        </ul>
      )}
    </>
  );
}
