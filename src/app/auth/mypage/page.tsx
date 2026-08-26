function Page() {
  return (
    <>
      <h2>회원정보</h2>

      <ul className='mypage_list'>
        <li>
          <p>사용자명</p>
          <span>홍길동</span>
        </li>
        <li>
          <p>이메일</p>
          <span>test@example.com</span>
        </li>
        <li>
          <button type='button' className='btn w-full'>
            비밀번호 수정
          </button>
        </li>
      </ul>
    </>
  );
}

export default Page;
