import { isLeft } from 'fp-ts/lib/Either';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { Endpoints } from "../api/endpoints";
import { deleteAuthCookies, getRefreshToken, setAuthCookies } from './cookies';
import { ClientId, TokenResponse } from "./util";

async function tokenRequest(data: object) {
    const response = await fetch(`${Endpoints.authApiInternal}/oauth2/token`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const parsed: unknown = await response.json();

    const decoded = TokenResponse.decode(parsed);
    if (isLeft(decoded)) {
        throw new Error('invalid auth server response');
    }

    return decoded.right;
}

async function revokeRequest(data: object) {
    const response = await fetch(`${Endpoints.authApiInternal}/oauth2/revoke`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.status !== 200) {
        throw new Error('revoke request failed');
    }
}

export async function handleCallback(cookieStore: ReadonlyRequestCookies, code: string | null, newState: string | null, storedState: string | null, storedVerifier: string | null) {
    if (!code || !newState || !storedState || !storedVerifier) {
        throw new Error('data missing');
    }

    if (newState !== storedState) {
        throw new Error('state mismatch');
    }

    const data = {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': ClientId,
        'client_secret': null,
        'redirect_uri': Endpoints.callbackUrl,
        'code_verifier': storedVerifier
    };

    const tokens = await tokenRequest(data);

    setAuthCookies(cookieStore, tokens['access_token'], tokens['refresh_token']);

    return true;
}

export async function refreshRequest(refreshToken: string) {
    const data = {
        'grant_type': 'refresh_token',
        'client_id': ClientId,
        'refresh_token': refreshToken,
    };

    return await tokenRequest(data);
}

export async function refreshTokens(accessToken: string | undefined, refreshToken: string | undefined): Promise<{ accessToken: string, refreshToken: string }> {
    if (!refreshToken) {
        throw new Error('refresh token missing');
    }

    let tokenExpired = true;

    if (accessToken) {
        const data = <JwtPayload>jwt.decode(accessToken);

        if (data.exp && data.exp > Date.now() / 1000) {
            tokenExpired = false;
        }
    }

    if (tokenExpired) {
        const tokens = await refreshRequest(refreshToken);

        console.log('Tokens refreshed!');

        accessToken = tokens['access_token'];
        refreshToken = tokens['refresh_token'];
    }

    return {
        accessToken: accessToken!,
        refreshToken: refreshToken
    };
}

export async function revokeTokens(cookieStore: ReadonlyRequestCookies) {
    const refreshToken = getRefreshToken(cookieStore);

    deleteAuthCookies(cookieStore);

    if (refreshToken) {
        await revokeRequest({
            'token': refreshToken,
            'token_type_hint': 'refresh_token',
            'client_id': ClientId,
            'client_secret': null
        });
    }
}