function Page() {
  return (
    <>
      <h2>로그인</h2>

      <form>
        <div className='form_area'>
          <div className='label_input_area'>
            <label htmlFor='email'>사용자명</label>
            <input type='text' id='email' />
          </div>
          <div className='label_input_area'>
            <label htmlFor='password'>비밀번호</label>
            <input type='password' id='password' />
          </div>
          <button type='submit' className='btn w-full'>
            로그인
          </button>
        </div>
      </form>
    </>
  );
}

export default Page;
