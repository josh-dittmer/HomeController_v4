import { NextRequest, NextResponse } from "next/server";
import { refreshIfExpired } from "./lib/auth/actions";

// automatically refresh token when expired
export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    try {
        await refreshIfExpired(req, res);
    } catch (e) {
        console.log('Token refresh failed: ' + e);
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
}

export const config = {
    matcher: ['/home', '/home/(.*)']
};