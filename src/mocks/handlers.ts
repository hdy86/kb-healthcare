import { http, HttpResponse } from "msw";
import type {
  SignInRequest,
  AuthTokenResponse,
  UserResponse,
  DashboardResponse,
  TaskListResponse,
  TaskDetailResponse,
  DeleteTaskResponse,
  ErrorResponse,
} from "../api/types";
import { MOCK_USER, TASKS, getDashboardCounts, findTaskById, deleteTaskById } from "./db";
import { issueTokenPair, decodeFakeJwt, isExpired } from "./fakeJwt";

const PAGE_SIZE = 20;

/**
 * Fetch 표준상 Set-Cookie는 Response 생성자에서 직접 못 넣는 forbidden header지만,
 * MSW의 HttpResponse는 이 헤더를 감지해서 document.cookie에 반영해줍니다.
 * (참고: https://mswjs.io/docs/http/mocking-responses/cookies/)
 */
function refreshTokenSetCookie(refreshToken: string) {
  const maxAge = 60 * 60 * 24 * 7; // 7일
  return `token=${refreshToken}; Path=/; Max-Age=${maxAge}`;
}

/** 로그아웃 시 refreshToken 쿠키를 즉시 만료시키는 Set-Cookie 값 */
function expiredTokenSetCookie() {
  return `token=; Path=/; Max-Age=0`;
}

/** Authorization: Bearer {token} 헤더에서 유효한 accessToken을 검증합니다. */
function requireBearerAuth(request: Request): true | HttpResponse<ErrorResponse> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (!token || isExpired(token) || !decodeFakeJwt(token)) {
    return HttpResponse.json<ErrorResponse>(
      { errorMessage: "인증 정보가 유효하지 않습니다. 다시 로그인해주세요." },
      { status: 401 },
    );
  }
  return true;
}

export const handlers = [
  // POST /api/sign-in
  http.post<never, SignInRequest, AuthTokenResponse | ErrorResponse>(
    "/api/sign-in",
    async ({ request }) => {
      const body = (await request.json()) as SignInRequest;

      if (body.email !== MOCK_USER.email || body.password !== MOCK_USER.password) {
        return HttpResponse.json<ErrorResponse>(
          { errorMessage: "이메일 또는 비밀번호가 올바르지 않습니다." },
          { status: 400 },
        );
      }

      const { accessToken, refreshToken } = issueTokenPair(MOCK_USER.id);
      // 실서버라면 refreshToken을 httpOnly Set-Cookie로 내려줍니다.
      // MSW 브라우저 환경에서도 document.cookie에 반영됩니다.
      return HttpResponse.json<AuthTokenResponse>(
        { accessToken, refreshToken },
        {
          status: 200,
          headers: { "Set-Cookie": refreshTokenSetCookie(refreshToken) },
        },
      );
    },
  ),

  // POST /api/refresh
  http.post<never, never, AuthTokenResponse | ErrorResponse>(
    "/api/refresh",
    async ({ cookies }) => {
      const refreshToken = cookies["token"];

      if (!refreshToken || isExpired(refreshToken) || !decodeFakeJwt(refreshToken)) {
        return HttpResponse.json<ErrorResponse>(
          { errorMessage: "세션이 만료되었습니다. 다시 로그인해주세요." },
          { status: 401 },
        );
      }

      const payload = decodeFakeJwt(refreshToken);
      if (!payload) {
        return HttpResponse.json<ErrorResponse>(
          { errorMessage: "잘못된 토큰입니다." },
          { status: 400 },
        );
      }

      const next = issueTokenPair(payload.id);

      return HttpResponse.json<AuthTokenResponse>(next, {
        status: 200,
        headers: { "Set-Cookie": refreshTokenSetCookie(next.refreshToken) },
      });
    },
  ),

  // POST /api/logout
  http.post("/api/logout", () => {
    return new HttpResponse(null, {
      status: 204,
      headers: { "Set-Cookie": expiredTokenSetCookie() },
    });
  }),

  // GET /api/user
  http.get<never, never, UserResponse | ErrorResponse>("/api/user", ({ request }) => {
    const authResult = requireBearerAuth(request);
    if (authResult !== true) return authResult;

    return HttpResponse.json<UserResponse>({
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      memo: MOCK_USER.memo,
    });
  }),

  // GET /api/dashboard
  http.get<never, never, DashboardResponse | ErrorResponse>("/api/dashboard", ({ request }) => {
    const authResult = requireBearerAuth(request);
    if (authResult !== true) return authResult;

    return HttpResponse.json<DashboardResponse>(getDashboardCounts());
  }),

  // GET /api/task?page=
  http.get<never, never, TaskListResponse | ErrorResponse>("/api/task", ({ request }) => {
    const authResult = requireBearerAuth(request);
    if (authResult !== true) return authResult;

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const data = TASKS.slice(start, end);
    const hasNext = end < TASKS.length;

    return HttpResponse.json<TaskListResponse>({ data, hasNext });
  }),

  // GET /api/task/:id
  http.get<{ id: string }, never, TaskDetailResponse | ErrorResponse>(
    "/api/task/:id",
    ({ request, params }) => {
      const authResult = requireBearerAuth(request);
      if (authResult !== true) return authResult;

      const task = findTaskById(String(params.id));
      if (!task) {
        return HttpResponse.json<ErrorResponse>(
          { errorMessage: "해당 할 일을 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      return HttpResponse.json<TaskDetailResponse>({
        title: task.title,
        memo: task.memo,
        status: task.status,
        registerDatetime: new Date().toISOString(),
      });
    },
  ),

  // DELETE /api/task/:id
  http.delete<{ id: string }, never, DeleteTaskResponse | ErrorResponse>(
    "/api/task/:id",
    ({ request, params }) => {
      const authResult = requireBearerAuth(request);
      if (authResult !== true) return authResult;

      const deleted = deleteTaskById(String(params.id));
      if (!deleted) {
        return HttpResponse.json<ErrorResponse>(
          { errorMessage: "해당 할 일을 찾을 수 없습니다." },
          { status: 404 },
        );
      }

      return HttpResponse.json<DeleteTaskResponse>({ success: true });
    },
  ),
];
