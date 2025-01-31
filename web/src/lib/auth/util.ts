import * as t from 'io-ts';

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
