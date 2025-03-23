import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { AuthCookieSettings, getExpiration, TokenStorageNames } from "./util";

export function getAccessToken(cookieStore: ReadonlyRequestCookies) {
    return cookieStore.get(TokenStorageNames.accessToken)?.value;
}

export function getRefreshToken(cookieStore: ReadonlyRequestCookies) {
    return cookieStore.get(TokenStorageNames.refreshToken)?.value;
}

export function setAuthCookies(cookieStore: ReadonlyRequestCookies, accessToken: string, refreshToken: string, expiresIn: number) {
    cookieStore.set(TokenStorageNames.accessToken, accessToken, AuthCookieSettings);
    cookieStore.set(TokenStorageNames.refreshToken, refreshToken, AuthCookieSettings);
    cookieStore.set(TokenStorageNames.expiration, getExpiration(expiresIn), AuthCookieSettings);
}

export function deleteAuthCookies(cookieStore: ReadonlyRequestCookies) {
    cookieStore.delete(TokenStorageNames.accessToken);
    cookieStore.delete(TokenStorageNames.refreshToken);
    cookieStore.delete(TokenStorageNames.expiration);
}