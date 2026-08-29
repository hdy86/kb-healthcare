import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

/*
 * index.tsx 등 엔트리 포인트에서:
 *
 *   async function enableMocking() {
 *     if (import.meta.env.MODE !== "development") return;
 *     const { worker } = await import("./mocks/browser");
 *     return worker.start({ onUnhandledRequest: "bypass" });
 *   }
 *
 *   enableMocking().then(() => {
 *     createRoot(document.getElementById("root")!).render(<App />);
 *   });
 *
 * 브라우저 mock 환경에서는 document.cookie API의 특성상
 * 진짜 httpOnly 쿠키를 재현할 수는 없습니다(JS가 여전히 읽을 수 있음).
 * 실서버로 교체 시 이 부분은 자연스럽게 진짜 httpOnly로 대체됩니다.
 */
