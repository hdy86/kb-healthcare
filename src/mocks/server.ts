import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

/*
 * vitest setup 파일(예: src/setupTests.ts)에서:
 *
 *   import { server } from "./mocks/server";
 *
 *   beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
 *   afterEach(() => server.resetHandlers());
 *   afterAll(() => server.close());
 *
 * 개별 테스트에서 특정 케이스(예: 400/401/404)만 오버라이드하고 싶다면
 * server.use(http.post("/api/sign-in", () => HttpResponse.json(...)))
 * 형태로 해당 테스트 안에서만 핸들러를 덮어쓸 수 있습니다.
 */
