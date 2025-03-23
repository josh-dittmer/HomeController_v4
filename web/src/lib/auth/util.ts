import * as t from 'io-ts';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { Endpoints } from '../api/endpoints';

export type LoginUrlInfo = {
    url: string,
    state: string,
    verifier: string
}

export const TokenResponse = t.type({
    token_type: t.string,
    access_token: t.string,
    refresh_token: t.string,
    expires_in: t.number,
    scope: t.string,
});

export type TokenResponseT = t.TypeOf<typeof TokenResponse>;

export const TokenStorageNames = {
    accessToken: 'access_token',
    refreshToken: 'refresh_token',
    expiration: 'expiration',
};

export const TokenLifetimes = {
    accessToken: parseInt(process.env.ACCESS_TOKEN_LIFETIME!) - 3 /* account for possible latency */,
    refreshToken: parseInt(process.env.REFRESH_TOKEN_LIFETIME!)
}

export const ClientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

export const authCookieSettings = (maxAge: number): Partial<ResponseCookie> => ({
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    //maxAge: maxAge
});

export async function createLoginUrl(clearSession: boolean): Promise<LoginUrlInfo> {
    const { state, verifier, challenge } = await createAuth();

    const url = new URL(`${Endpoints.authApiPublic}/oauth2/authorize`);
    url.searchParams.set('client_id', ClientId);
    url.searchParams.set('redirect_uri', Endpoints.callbackUrl);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'app_access');
    url.searchParams.set('state', state);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');

    if (clearSession) {
        url.searchParams.set('clear_session', '1');
    }

    console.log(url.href);

    return {
        url: url.href,
        state: state,
        verifier: verifier
    }
}

export function pastExpiration(expiration: string): boolean {
    return Date.now() >= Number.parseInt(expiration);
}

export function getExpiration(expiresIn: number) {
    const expr = Date.now() + expiresIn * 1000;
    return expr.toString();
}

function base64UrlEncode(a: ArrayBuffer) {
    let str = '';
    const bytes = new Uint8Array(a);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
    }

    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function dec2hex(dec: number) {
    return ('0' + dec.toString(16)).substr(-2);
}

function genRandomString(len: number = 80): string {
    const array = new Uint32Array(len / 2);
    crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

async function challengeFromVerifier(verifier: string): Promise<string> {
    const hashed = await sha256(verifier);
    return base64UrlEncode(hashed);
}

export async function createAuth() {
    const state = genRandomString(10);
    const verifier = genRandomString(80);
    const challenge = await challengeFromVerifier(verifier);

    return { state, verifier, challenge };
}
