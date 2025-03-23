import { NextRequest, NextResponse } from "next/server";
import { refreshTokens } from "./lib/auth/oauth";
import { AuthCookieSettings, TokenStorageNames } from "./lib/auth/util";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    try {
        let currAccessToken = req.cookies.get(TokenStorageNames.accessToken)?.value ?? '';
        let currRefreshToken = req.cookies.get(TokenStorageNames.refreshToken)?.value;
        let currExpiration = req.cookies.get(TokenStorageNames.expiration)?.value;

        const { accessToken, refreshToken, expiration } = await refreshTokens(currAccessToken, currRefreshToken, currExpiration);

        res.cookies.set(TokenStorageNames.accessToken, accessToken, AuthCookieSettings);
        res.cookies.set(TokenStorageNames.refreshToken, refreshToken, AuthCookieSettings);
        res.cookies.set(TokenStorageNames.expiration, expiration, AuthCookieSettings);
    } catch (e) {
        console.log(e);
    }

    return res;
}

export const config = {
    matcher: ['/home', '/home/(.*)', '/test']
};