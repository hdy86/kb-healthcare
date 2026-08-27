import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import * as SCHEMAS from "@constants/schemas";

// ==================== VALIDATION ====================
const validSchema = z.object({
  email: SCHEMAS.EMAIL,
  password: SCHEMAS.PASSWORD,
});
type FormData = z.infer<typeof validSchema>;

function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(validSchema),
  });

  // ==================== HANDLER ====================
  // SUBMIT
  const onSubmit = () => {};

  return (
    <>
      <h2>로그인</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form_area'>
          <div className='label_input_area'>
            <label htmlFor='email'>사용자명</label>
            <input type='text' id='email' {...register("email")} />
            {errors.email && <span className='error_msg'>{errors.email.message}</span>}
          </div>
          <div className='label_input_area'>
            <label htmlFor='password'>비밀번호</label>
            <input type='password' id='password' {...register("password")} maxLength={24} />
            {errors.password && <span className='error_msg'>{errors.password.message}</span>}
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
