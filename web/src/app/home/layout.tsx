import { ReactNode } from "react";

import Home from "@/components/home/home";
import { getMyProfile, getTicket } from "@/lib/api/requests";
import { getAccessToken } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export default async function HomeLayout({ children }: { children: ReactNode }) {
    const accessToken = getAccessToken(await cookies());

    const profileRes = await getMyProfile(accessToken);
    const ticketRes = await getTicket(accessToken);
    //await new Promise((resolve) => setTimeout(resolve, 5000))

    return (
        <Home profileRes={profileRes} ticketRes={ticketRes}>
            {children}
        </Home>
    )
}