import axios, { AxiosError, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import type { AuthTokenResponse, ErrorResponse } from "./types";
import { store } from "@stores/index";

/**
 * accessToken은 메모리에만 보관합니다.(XSS 대비 localStorage 지양)
 * 새로고침 시 유실되므로, 앱 부트스트랩 시점에 /api/refresh를 한 번 호출해 재발급받는 흐름을 App 최상단에서 태워줍니다.
 */
export function setAccessToken(token: string | null) {
  store.getState().setAccessToken(token);
}

export function getAccessToken() {
  return store.getState().accessToken;
}

export class ApiError extends Error {
  status: number;
  errorMessage: string;

  constructor(status: number, errorMessage: string) {
    super(errorMessage);
    this.status = status;
    this.errorMessage = errorMessage;
  }
}

// 재시도 여부를 표시하기 위해 config에 커스텀 플래그를 얹어 씁니다.
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const httpClient = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 요청 인터셉터: accessToken이 있으면 항상 Authorization 헤더에 실어 보냄
httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<boolean> | null = null;

/**
 * 동시에 여러 요청이 401을 맞아도 refresh는 한 번만 실행되도록 dedupe.
 * 401 인터셉터뿐 아니라, 앱 부트스트랩 시점의 세션 복구(restoreSession)에도 그대로 재사용합니다.
 */
export async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    // 인터셉터 재귀 호출을 피하기 위해 httpClient가 아닌 별도 axios 인스턴스로 호출
    refreshPromise = axios
      .post<AuthTokenResponse>("/api/refresh", null, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// 응답 인터셉터: 401을 받으면 refresh 후 원래 요청을 1회만 재시도
httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const config = error.config as RetryableConfig | undefined;

    if (error.response?.status === 401 && config && !config._retry) {
      config._retry = true;
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return httpClient(config);
      }
    }

    return Promise.reject(error);
  },
);

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  // 401을 받았을 때 refresh 후 1회 재시도할지 여부 (기본 true)
  retryOnUnauthorized?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers, retryOnUnauthorized = true } = options;

  const config: AxiosRequestConfig & { _retry?: boolean } = {
    url: path,
    method,
    data: body,
    headers,
  };

  // refresh 재시도를 원치 않는 요청은 인터셉터를 타지 않도록 미리 _retry를 true로 마킹
  if (!retryOnUnauthorized) {
    (config as RetryableConfig)._retry = true;
  }

  try {
    const response = await httpClient.request<T>(config);
    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const status = err.response?.status ?? 0;
      const errorMessage = err.response?.data?.errorMessage ?? "알 수 없는 오류가 발생했습니다.";
      throw new ApiError(status, errorMessage);
    }
    throw err;
  }
}

/**
 * accessToken은 즉시(동기적으로) 로컬 상태에서 제거해 화면이 바로 로그아웃 상태로 반영되게 하고, 서버(/api/logout) 호출은 refreshToken 쿠키를 무효화하기 위해 best-effort로 시도합니다.
 * 이 요청이 실패하더라도 (네트워크 문제, 이미 만료된 세션 등) 클라이언트 상태는 이미 정리된 뒤이므로 화면 동작에는 영향이 없습니다.
 */
export async function clearSession(): Promise<void> {
  setAccessToken(null);
  try {
    await apiFetch("/api/logout", { method: "POST", retryOnUnauthorized: false });
  } catch {
    console.log("로그아웃에 실패했습니다.");
  }
}
