import { z } from "zod";

// 이메일
export const EMAIL = z
  .string()
  .trim()
  .nonempty("이메일 주소를 입력해 주세요.")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "올바른 이메일 형식으로 입력해 주세요.",
  );

// 비밀번호
export const PASSWORD = z
  .string()
  .trim()
  .nonempty("비밀번호를 입력해 주세요.")
  .refine((val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/.test(val), {
    message: "영문 대문자와 소문자, 숫자를 조합해 8-24자 이내로 입력하세요.",
  })
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .max(24, "비밀번호는 24자 이하여야 합니다.");
