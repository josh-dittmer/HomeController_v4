'use server';

import { handleCallback } from "@/lib/auth/oauth";
import { cookies } from "next/headers";

export async function handleCallbackOnServer(code: string | null, newState: string | null, storedState: string | null, storedVerifier: string | null) {
    const cookieStore = await cookies();
    return handleCallback(cookieStore, code, newState, storedState, storedVerifier)
}