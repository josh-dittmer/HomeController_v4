'use server';

import { TokenStorageNames } from "@/lib/auth/util";
import { cookies } from "next/headers";


export async function test() {
    const cookieStore = await cookies();
    console.log(cookieStore.get(TokenStorageNames.accessToken))
    console.log('EXECUTING ON SERVER');
}