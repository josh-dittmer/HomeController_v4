import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "./lib/auth/actions";
import { AuthCookieSettings, TokenStorageNames } from "./lib/auth/util";

// automatically refresh token when expired
export async function middleware(req: NextRequest) {
    /*console.log('.');
    
    const res = NextResponse.next();

    try {
        const refreshed = await refreshIfExpired(req, res);

        if (refreshed) {
            applySetCookie(req, res);
        }
    } catch (e) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;*/

    const res = NextResponse.next();

    try {
        const [accessToken, refreshToken, expiration] = await getAccessToken(req, res);

        res.cookies.set(TokenStorageNames.accessToken, accessToken, AuthCookieSettings);
        res.cookies.set(TokenStorageNames.refreshToken, refreshToken, AuthCookieSettings);
        res.cookies.set(TokenStorageNames.expiration, expiration, AuthCookieSettings);

        res.headers.set('Authorization', `Bearer ${accessToken}`);
        console.log()
    } catch (e) {
        console.log(e);
    }

    return res;
}

export const config = {
    matcher: ['/api/(.*)']
};