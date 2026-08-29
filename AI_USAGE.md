# AI_USAGE.md

## 사용한 도구/모델

- **도구**: Claude (Anthropic) — claude.ai 웹 인터페이스
- **모델**: Claude Sonnet 5 (대화형 채팅 인터페이스 기준)

## 핵심 프롬프트 요약

- API mocking 방식 선택 및 MSW 핸들러 구성 요청
- 로그인 상태에 따른 GNB 표시, 라우트 접근 제어 (RequireAuth) 구현 요청
- 로그아웃 구현 및 관련 버그 (토스트 오작동, 쿠키 미정리) 디버깅
- Vercel 배포 시 MSW/라우팅 이슈 해결 요청

## 적용한 작업 범위

과제 요구사항(`requirement 1.md`, `openapi.yaml`)을 기반으로 아래 영역에서 Claude와 대화하며 코드를 작성/검토했습니다.

- **API mocking** : `openapi.yaml` 기준 MSW 핸들러 작성 (sign-in/refresh/user/dashboard/task 목록·상세·삭제), 인메모리 mock DB 및 mock JWT 유틸리티
- **HTTP 클라이언트** : axios 전환, 인터셉터로 401 시 자동 refresh + 원 요청 재시도
- **인증 상태** : zustand 스토어로 accessToken 관리, 앱 부트스트랩 시 `/api/refresh`로 세션 복구
- **라우트 가드** : `RequireAuth`로 대시보드/할일 목록·상세/회원 정보 페이지 보호, `GuestOnly`로 로그인 페이지 보호
- **로그아웃** : `/api/logout` 엔드포인트 (스펙 외 추가) + accessToken 제거 + react-query 캐시 클리어
- **회원 정보** : 로그인 정보에 포함될 듯한 `email` 필드 추가 노출
- **할 일 목록** : `useInfiniteQuery` 기반 무한 스크롤
- **배포** : Vercel SPA 라우팅 새로고침 404 방지를 위한 `vercel.json` rewrite 설정

## 디버깅 (원인 파악 포함)

- 로그아웃 후에도 refreshToken이 남아있는 것처럼 보이던 문제 → MSW가 localStorage(`**msw-cookie-store**`)에 별도 가상 쿠키 저장소를 두는 것이 원인 → 이를 계기로 `/api/logout` 엔드포인트를 신설
- 새로고침 시 `/api/refresh`가 항상 401 나던 문제 → 인메모리 validRefreshTokens Set이 새로고침마다 초기화되는 것이 원인 → JWT 자체 검증으로 완화
- 로그아웃 시 "로그인이 필요한 페이지입니다." 토스트가 잘못 뜨던 문제 → 세션 만료와 의도된 로그아웃을 구분 못한 원인 → `client.ts`에 1회성 플래그 (`markLogout`/`consumeSkipToast`) 신설 + toast를 render 밖 `useEffect`로 이동해 해결

## 사람이 최종 검증한 내용

- [ ] 폰트(Pretendard), 색상 토큰, 레이아웃 등 심미적 요소는 AI 제안을 참고하되 직접 최종 결정
- [ ] `openapi.yaml` 스펙과 실제 MSW 핸들러 응답 구조가 정확히 일치하는지 직접 대조 확인
- [ ] `npm install` 및 `npx msw init public/ --save` 실행 후 브라우저에서 MSW 정상 동작(`[MSW] Mocking enabled.` 로그, Service Worker activated 상태) 확인
- [ ] 로그인/로그아웃/새로고침 세션 복구 시나리오 실제 동작 확인
- [ ] 무한 스크롤 및 가상 스크롤 실제 동작 확인
- [ ] 새로고침 시 세션 복구 및 GNB 아이콘 전환 실제 동작 확인
- [ ] Vercel 배포 후 새로고침 라우팅 정상 동작 확인

> ※ 위 체크리스트는 실제 확인 후 갱신 바랍니다.

## 비고

- API 서버는 MSW로 mocking (`requirement 1.md`의 "전문" 섹션에서 허용된 방식)
- mock 데이터는 Service Worker 인메모리 상태라 새로고침 시 초기화됨 (실제 백엔드 환경에서는 해당 없음)
- 대시보드/목록/상세에 로그인 가드를 적용한 것은, `openapi.yaml`상 sign-in을 제외한 모든 API가 bearerAuth를 요구하기 때문
- `/api/logout`은 `openapi.yaml`에 없는 엔드포인트를 추가 (스펙 외 임의 결정 사항)
- `UserResponse`에 `email` 필드를 `openapi.yaml` 스펙 대비 추가 확장 (스펙 외 임의 결정 사항)
