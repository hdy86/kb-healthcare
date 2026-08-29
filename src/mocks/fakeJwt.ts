import type { JwtPayload } from "../api/types";

/**
 * 실제 서명 검증은 하지 않는 목업용 JWT입니다.
 * header.payload.signature 형태만 흉내내어, 실서버 응답 구조와
 * 클라이언트의 "디코드해서 id/exp를 읽는" 로직을 동일하게 검증할 수 있게 합니다.
 */

const base64UrlEncode = (obj: unknown) =>
  btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const base64UrlDecode = (str: string) => {
  const padded = str
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  return JSON.parse(atob(padded));
};

export function createFakeJwt(payload: JwtPayload): string {
  const header = base64UrlEncode({ alg: "none", typ: "JWT" });
  const body = base64UrlEncode(payload);
  return `${header}.${body}.mock-signature`;
}

export function decodeFakeJwt(token: string): JwtPayload | null {
  try {
    const [, body] = token.split(".");
    if (!body) return null;
    return base64UrlDecode(body) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(token: string): boolean {
  const payload = decodeFakeJwt(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now();
}

export function issueTokenPair(userId: string) {
  const now = Math.floor(Date.now() / 1000);
  return {
    accessToken: createFakeJwt({ id: userId, exp: now + 60 * 15 }), // 15분
    refreshToken: createFakeJwt({ id: userId, exp: now + 60 * 60 * 24 * 7 }), // 7일
  };
}
