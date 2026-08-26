import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Page() {
  return (
    <>
      <h2>할일 상세</h2>

      <div className='task_detail'>
        <button type='button' className='del_btn'>
          <FontAwesomeIcon icon={faTrash} size='lg' />
        </button>
        <h3>할일 1</h3>
        <p>할일 1에 대한 상세 설명</p>
      </div>
    </>
  );
}

export default Page;
