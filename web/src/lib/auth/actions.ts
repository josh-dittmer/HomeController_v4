'use server';

import { isLeft } from 'fp-ts/lib/Either';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { ClientId, Endpoints } from "../api/endpoints";
import { AuthCookieSettings, createAuth, getExpiration, LoginUrlInfo, pastExpiration, TokenResponse, TokenStorageNames } from "./util";

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

    return {
        url: url.href,
        state: state,
        verifier: verifier
    }
}

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

export async function handleCallback(code: string | null, newState: string | null, storedState: string | null, storedVerifier: string | null) {
    const cookieStore = await cookies();

    if (!code || !newState || !storedState || !storedVerifier) {
        throw new Error('data missing');
    }

    if (newState !== storedState) {
        throw new Error('state mismatch');
    }

    const data = {
        grant_type: 'authorization_code',
        code: code,
        client_id: ClientId,
        client_secret: null,
        redirect_uri: Endpoints.callbackUrl,
        code_verifier: storedVerifier
    };

    const tokens = await tokenRequest(data);

    cookieStore.set(TokenStorageNames.accessToken, tokens.access_token, AuthCookieSettings);
    cookieStore.set(TokenStorageNames.refreshToken, tokens.refresh_token, AuthCookieSettings);
    cookieStore.set(TokenStorageNames.expiration, getExpiration(tokens.expires_in), AuthCookieSettings);

    return true;
}

export async function refreshRequest(refreshToken: string) {
    const data = {
        grant_type: 'refresh_token',
        client_id: ClientId,
        refresh_token: refreshToken,
    };

    return await tokenRequest(data);
}

export async function getTokens(req: NextRequest) {
    let accessToken = req.cookies.get(TokenStorageNames.accessToken)?.value;
    let refreshToken = req.cookies.get(TokenStorageNames.refreshToken)?.value;
    let expiration = req.cookies.get(TokenStorageNames.expiration)?.value;

    if (!accessToken || !refreshToken || !expiration) {
        throw new Error('cookies missing');
    }

    if (pastExpiration(expiration)) {
        const tokens = await refreshRequest(refreshToken);

        console.log(`UPDATING TOKENS - ${req.url} - ${accessToken.slice(-5)}`);

        accessToken = tokens.access_token;
        refreshToken = tokens.refresh_token;
        expiration = getExpiration(tokens.expires_in);
    }

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiration: expiration
    };
}

export async function revokeTokens() {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get(TokenStorageNames.refreshToken);

    cookieStore.delete(TokenStorageNames.accessToken);
    cookieStore.delete(TokenStorageNames.refreshToken);
    cookieStore.delete(TokenStorageNames.expiration);

    if (refreshToken) {
        await revokeRequest({
            token: refreshToken.value,
            token_type_hint: 'refresh_token',
            client_id: ClientId,
            client_secret: null
        });
    }
}