# 프론트엔드 과제

## 기술 스택

- React 19 + TypeScript + Vite
- react-router-dom (라우팅)
- @tanstack/react-query (서버 상태 관리)
- axios (HTTP 클라이언트)
- zustand (클라이언트 상태 관리)
- react-hook-form + zod (폼 검증)
- MSW (API Mocking)

## 실행 방법

```bash
npm install
npx msw init public/ --save   # 최초 1회만 실행 (public/mockServiceWorker.js 생성)
npm run dev
```

### 테스트 계정

```
email : test@example.com
password : test1234
```

## API Mocking

별도 백엔드 서버 없이 MSW로 API를 mocking 했습니다. 스펙은 `openapi.yaml` (OAS 3.1) 기준으로 구현했습니다.

- 핸들러 : `src/mocks/handlers.ts`
- mock 데이터 : `src/mocks/db.ts` (인메모리, 총 87개 할 일 데이터)
- mock JWT : `src/mocks/fakeJwt.ts` (서명 검증 없이 payload만 흉내)

> mock 데이터는 브라우저 Service Worker의 인메모리 상태로 관리되어 **새로고침 시 초기 상태로 리셋**됩니다. 실제 백엔드/DB가 없는 mock 환경의 한계이며, 실서버 연동 시에는 해당하지 않습니다.

## 폴더 구조

```
src/
  api/          # 실제 API 호출 함수, axios 클라이언트, react-query 훅
  app/          # 페이지 컴포넌트
  assets/       # scss 등 정적 리소스
  components/   # 공용 컴포넌트 (GNB, 로딩, 모달, 라우트 가드 등)
  constants/    # 라우트 경로, 유효성 검증 스키마 등 상수
  hooks/        # 공용 커스텀 훅
  mocks/        # MSW 핸들러 및 mock 데이터
  stores/       # zustand 상태 관리
```

## 주요 설계/판단 근거

과제 스펙에 명시되지 않아 자체적으로 판단한 부분들입니다.

- **로그인 가드 적용 범위** : `openapi.yaml` 기준 `sign-in`을 제외한 모든 API가 `bearerAuth`를 요구하여, 로그인 없이는 실질적으로 볼 수 있는 데이터가 없다고 판단하여 대시보드/할 일 목록·상세/회원정보 페이지에 로그인 가드(`RequireAuth`)를 적용했습니다. GNB 메뉴 자체는 스펙대로 로그인 여부와 무관하게 항상 노출됩니다.
- **`/api/logout` 엔드포인트 추가** : `openapi.yaml`에 없는 엔드포인트지만, 클라이언트 단독으로는 `refreshToken` 쿠키를 완전히 무효화하기 어려워 서버(mock) 쪽에 임의로 추가했습니다.
- **회원정보 이메일 노출** : 로그인 시 이미 이메일 정보를 받고 있으므로, 회원정보 페이지에서도 이 값을 활용해 이메일을 노출하도록 `UserResponse`에 `email` 필드를 임의로 추가했습니다.
- **할일 완료/미완료 상태 표시** : `TaskItem.status`가 이미 API 응답에 포함되어 있어, 할 일 목록과 상세 페이지에 완료/미완료 여부를 임의로 추가 표시했습니다. 대시보드가 이 값을 기준으로 "해야할 일"/"한 일" 수치를 보여주는 것과 자연스럽게 연결되도록 하기 위함입니다.
- **할일 삭제 시 대시보드 쿼리 무효화** : 할 일 상세에서 삭제하면 할 일 목록뿐 아니라 대시보드의 통계 쿼리도 함께 무효화하도록 했습니다. 대시보드 수치(일/해야할 일/한 일)가 삭제 직후에도 최신 상태를 반영하도록 하기 위함입니다.
- **색상 토큰** : CSS 변수 기반으로 관리하며 `primary`, `secondary`, `error`, `disabled` 등 의미 기반으로 네이밍했습니다.
- **프로덕션 빌드에서도 MSW 활성화** : 별도 백엔드가 없어 배포 환경에서도 앱이 정상 동작하려면 MSW가 필요하여 `VITE_ENABLE_MOCKS` 환경변수로 별도 제어하도록 했습니다.

## 알려진 한계

- mock 데이터는 새로고침 시 초기화됩니다 (위 "API Mocking" 참고).
- 프로덕션 배포 환경에서도 MSW를 활성화한 것은 실제 백엔드가 있는 서비스라면 제거되어야 할 임시 조치입니다.

## 배포

- Vercel로 배포했으며, SPA 클라이언트 사이드 라우팅의 새로고침 404 방지를 위해 `vercel.json`에 rewrite 설정을 추가했습니다.
- 배포 URL: [https://kb-healthcare.vercel.app/](https://kb-healthcare.vercel.app/)

## AI 도구 사용 내역

`AI_USAGE.md`를 참고해주세요.
