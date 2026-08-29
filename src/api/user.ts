import { apiFetch, setAccessToken } from "./client";
import type { SignInRequest, AuthTokenResponse, UserResponse } from "./types";

export async function signIn(body: SignInRequest): Promise<AuthTokenResponse> {
  const result = await apiFetch<AuthTokenResponse>("/api/sign-in", {
    method: "POST",
    body,
    retryOnUnauthorized: false,
  });
  setAccessToken(result.accessToken);
  return result;
}

export const getUser = () => apiFetch<UserResponse>("/api/user");
