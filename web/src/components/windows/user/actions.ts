'use server';

import { revokeTokens } from "@/lib/auth/oauth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    await revokeTokens(await cookies());
    redirect('/login?clear_session=1');
}