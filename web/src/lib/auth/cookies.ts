import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { authCookieSettings, TokenLifetimes, TokenStorageNames } from "./util";

export function getAccessToken(cookieStore: ReadonlyRequestCookies) {
    return cookieStore.get(TokenStorageNames.accessToken)?.value;
}

export function getRefreshToken(cookieStore: ReadonlyRequestCookies) {
    return cookieStore.get(TokenStorageNames.refreshToken)?.value;
}

export function setAuthCookies(cookieStore: ReadonlyRequestCookies, accessToken: string, refreshToken: string) {
    cookieStore.set(TokenStorageNames.accessToken, accessToken, authCookieSettings(TokenLifetimes.accessToken));
    cookieStore.set(TokenStorageNames.refreshToken, refreshToken, authCookieSettings(TokenLifetimes.refreshToken));
    //cookieStore.set(TokenStorageNames.expiration, getExpiration(expiresIn), AuthCookieSettings);
}

export function deleteAuthCookies(cookieStore: ReadonlyRequestCookies) {
    cookieStore.delete(TokenStorageNames.accessToken);
    cookieStore.delete(TokenStorageNames.refreshToken);
    //cookieStore.delete(TokenStorageNames.expiration);
}