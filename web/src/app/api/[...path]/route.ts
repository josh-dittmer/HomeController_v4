import { Endpoints } from "@/lib/api/endpoints";
import { refreshTokens } from "@/lib/auth/oauth";
import { authCookieOptions, TokenStorageNames } from "@/lib/auth/util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const AllowedPaths: Record<string, string[]> = {
    'GET': ['/ticket'],
    'POST': ['/device/create', '/device/(.*)/edit', '/user/create', '/user/edit'],
    'DELETE': ['/device/(.*)/delete']
};

const Versions: Record<string, string> = {
    'v1': Endpoints.mainApiInternalUrl
};

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {

    return proxyRequest(
        request.method,
        (await params).path,
        request
    );
}

async function proxyRequest(method: string, path: string[], request: NextRequest) {
    const pathStr = path.join('/');

    let match = false;

    const exps = AllowedPaths[request.method];
    exps.forEach((exp) => {
        const r = new RegExp(exp);
        if (r.test(pathStr))
            match = true;
    });

    if (!match) {
        return new NextResponse('', { status: 401 });
    }

    const url = `${Versions[path[0]]}/api/${pathStr}`;

    const cookieStore = await cookies();
    const headers = new Headers(request.headers);

    try {
        const currAccessToken = cookieStore.get(TokenStorageNames.accessToken)?.value;
        const currRefreshToken = cookieStore.get(TokenStorageNames.refreshToken)?.value;

        const { accessToken, refreshToken } = await refreshTokens(currAccessToken, currRefreshToken);

        headers.set('Authorization', `Bearer ${accessToken}`);

        cookieStore.set(TokenStorageNames.accessToken, accessToken, authCookieOptions());
        cookieStore.set(TokenStorageNames.refreshToken, refreshToken, authCookieOptions());
    } catch {
        redirect('/login');
    }

    const text = await request.text();

    const response = await fetch(url, {
        method: method,
        body: text !== '' ? text : undefined,
        headers: headers
    });

    return response;
}

export const GET = handler;
export const POST = handler;
export const DELETE = handler;