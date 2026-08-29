import useStore from "@stores/index";

/**
 * 로그인 여부를 반응형으로 구독하는 훅입니다.
 * signIn 성공/refresh 성공/로그아웃(setAccessToken(null)) 등
 * accessToken이 바뀌는 모든 시점에 자동으로 리렌더링됩니다.
 */
export function useAuth() {
  return useStore((state) => state.accessToken !== null);
}
