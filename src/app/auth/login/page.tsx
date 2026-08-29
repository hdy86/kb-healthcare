import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ApiError } from "@api/client";
import { useSignIn } from "@api/hooks/useSignin";
import * as SCHEMAS from "@constants/schemas";
import Modal from "@components/shared/modal";

// ==================== VALIDATION ====================
const validSchema = z.object({
  email: SCHEMAS.EMAIL,
  password: SCHEMAS.PASSWORD,
});
type FormData = z.infer<typeof validSchema>;

export default function Page() {
  const navigate = useNavigate();
  const [errorModalOpen, setErrorModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(validSchema),
    mode: "onChange",
  });

  // ==================== API ====================
  const { mutate, isPending, error, reset } = useSignIn();

  const errorMessage =
    error instanceof ApiError ? error.errorMessage : "알 수 없는 오류가 발생했습니다.";

  // ==================== HANDLER ====================
  // SUBMIT
  const onSubmit = async (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/", { replace: true });
        toast.success("로그인 성공!");
      },
      onError: () => {
        setErrorModalOpen(true);
      },
    });
  };

  return (
    <>
      <h2>로그인</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form_area'>
          <div className='label_input_area'>
            <label htmlFor='email' className='label'>
              사용자명
            </label>
            <input type='text' id='email' className='input' {...register("email")} />
            {errors.email && <span className='error_msg'>{errors.email.message}</span>}
          </div>
          <div className='label_input_area'>
            <label htmlFor='password' className='label'>
              비밀번호
            </label>
            <input
              type='password'
              id='password'
              className='input'
              {...register("password")}
              maxLength={24}
            />
            {errors.password && <span className='error_msg'>{errors.password.message}</span>}
          </div>
          <button type='submit' className='btn w-full' disabled={!isValid || isPending}>
            로그인
          </button>
        </div>
      </form>

      {/* MODAL */}
      <Modal
        open={errorModalOpen}
        onClose={() => {
          setErrorModalOpen(false);
          reset();
        }}
        title='로그인 불가'
      >
        {errorMessage}
      </Modal>
    </>
  );
}
