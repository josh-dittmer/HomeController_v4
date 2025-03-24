import { NextRequest, NextResponse } from "next/server";
import { refreshTokens } from "./lib/auth/oauth";
import { authCookieOptions, TokenStorageNames } from "./lib/auth/util";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    try {
        const currAccessToken = req.cookies.get(TokenStorageNames.accessToken)?.value;
        const currRefreshToken = req.cookies.get(TokenStorageNames.refreshToken)?.value;

        const { accessToken, refreshToken } = await refreshTokens(currAccessToken, currRefreshToken);

        res.cookies.set(TokenStorageNames.accessToken, accessToken, authCookieOptions());
        res.cookies.set(TokenStorageNames.refreshToken, refreshToken, authCookieOptions());
    } catch (e) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    return res;
}

export const config = {
    matcher: ['/home', '/home/(.*)', '/test']
};