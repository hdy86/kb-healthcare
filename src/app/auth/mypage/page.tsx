import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "@api/hooks/useUser";
import { useLogout } from "@hooks/useLogout";
import Loading from "@components/shared/loading";
import Modal from "@components/shared/modal";

export default function Page() {
  const [logoutOpen, setLogoutOpen] = useState(false);

  // ==================== API ====================
  const { data, isLoading } = useUser();
  const logout = useLogout();

  const onLogout = () => {
    setLogoutOpen(false);
    logout();
    toast.success("로그아웃 완료!");
  };

  return (
    <>
      <h2>회원정보</h2>

      {isLoading ? (
        <Loading />
      ) : (
        <ul className='mypage_list'>
          <li>
            <p>사용자명</p>
            <span>{data?.name || "-"}</span>
          </li>
          <li>
            <p>이메일</p>
            <span>{data?.email || "-"}</span>
          </li>
          <li>
            <button type='button' className='btn type02 w-full' onClick={() => setLogoutOpen(true)}>
              로그아웃
            </button>
          </li>
        </ul>
      )}
      {/* MODAL */}
      <Modal
        open={logoutOpen}
        onClose={onLogout}
        title='로그아웃'
        btns={
          <button type='button' className='btn type02 sm' onClick={() => setLogoutOpen(false)}>
            취소
          </button>
        }
      >
        로그아웃 하시겠습니까?
      </Modal>
    </>
  );
}
