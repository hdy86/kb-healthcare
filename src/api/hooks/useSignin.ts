import { useMutation } from "@tanstack/react-query";
import type { SignInRequest } from "../types";
import { signIn } from "../user";

export function useSignIn() {
  return useMutation({
    mutationFn: (body: SignInRequest) => signIn(body),
  });
}
