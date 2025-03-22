import { Endpoints } from "@/lib/api/endpoints";
import { getTokens } from "@/lib/auth/actions";
import { AuthCookieSettings, TokenStorageNames } from "@/lib/auth/util";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const AllowedPaths: Record<string, string[]> = {
    'GET': [''],
    'POST': [],
    'DELETE': []
};

const Versions: Record<string, string> = {
    'v1': Endpoints.mainApiInternalUrl
};

async function proxyRequest(method: string, path: string[], request: NextRequest) {
    const url = `${Versions[path[0]]}/api/${path.join('/')}`;

    const cookieStore = await cookies();
    const headers = new Headers(request.headers);

    try {
        const { accessToken, refreshToken, expiration } = await getTokens(request);

        cookieStore.set(TokenStorageNames.accessToken, accessToken, AuthCookieSettings);
        cookieStore.set(TokenStorageNames.refreshToken, refreshToken, AuthCookieSettings);
        cookieStore.set(TokenStorageNames.expiration, expiration, AuthCookieSettings);

        headers.set('Authorization', `Bearer ${accessToken}`);
    } catch (e) {
        console.log(e);
    }

    const response = await fetch(url, {
        method: method,
        body: request.bodyUsed ? await request.text() : undefined,
        headers: headers
    });

    return response;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(
        request.method,
        (await params).path,
        request
    );
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(
        request.method,
        (await params).path,
        request
    );
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return proxyRequest(
        request.method,
        (await params).path,
        request
    );
}