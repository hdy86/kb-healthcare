import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ApiError } from "@api/client";
import { useTaskDetail } from "@api/hooks/useTaskDetail";
import { useDeleteTask } from "@api/hooks/useDeleteTask";
import Loading from "@components/shared/loading";
import Modal from "@components/shared/modal";
import * as ROUTERS from "@constants/routers";

export default function Page() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id || "";
  const [confirmValue, setConfirmValue] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // ==================== API ====================
  const { isLoading, data, error } = useTaskDetail(id);
  const { mutate, isPending } = useDeleteTask();

  const onDelete = () => {
    mutate(id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setConfirmValue("");
        toast.success("삭제되었습니다.");
        navigate(ROUTERS.TASK);
      },
      onError: (err) => {
        toast.error(err instanceof ApiError ? err.errorMessage : "삭제에 실패했습니다.");
      },
    });
  };

  return (
    <>
      <h2>할일 상세</h2>

      {isLoading ? (
        <Loading />
      ) : error instanceof ApiError && error.status === 404 ? (
        <div className='no_task_detail'>
          <p>해당 할 일을 찾을 수 없습니다.</p>
          <button type='button' className='btn sm' onClick={() => navigate(ROUTERS.TASK)}>
            목록으로 돌아가기
          </button>
        </div>
      ) : (
        <>
          <div className='task_detail'>
            <button type='button' className='del_btn' onClick={() => setDeleteModalOpen(true)}>
              <FontAwesomeIcon icon={faTrash} size='lg' />
            </button>
            <h3>{data?.title || "-"}</h3>
            <p>{data?.memo || "-"}</p>
          </div>

          <button type='button' className='btn sm' onClick={() => navigate(ROUTERS.TASK)}>
            목록
          </button>
        </>
      )}

      {/* MODAL */}
      <Modal
        open={deleteModalOpen}
        title='할일 삭제'
        btns={
          <>
            <button
              type='button'
              className='btn sm'
              onClick={onDelete}
              disabled={confirmValue.trim() !== id || isPending}
            >
              제출
            </button>
            <button
              type='button'
              className='btn type02 sm'
              onClick={() => {
                setDeleteModalOpen(false);
                setConfirmValue("");
              }}
              disabled={isPending}
            >
              취소
            </button>
          </>
        }
      >
        <label htmlFor='reason' className='mb-3 block'>
          이 작업은 되돌릴 수 없습니다.
          <br />
          삭제하려면 아래 입력창에 <br />할 일의 ID ( <b>{id}</b> ) 를 정확히 입력해 주세요.
        </label>
        <input
          type='text'
          id='reason'
          className='input'
          value={confirmValue}
          onChange={(e) => setConfirmValue(e.target.value)}
          autoComplete='off'
        />
      </Modal>
    </>
  );
}
