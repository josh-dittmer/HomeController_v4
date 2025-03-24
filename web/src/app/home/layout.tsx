import { ReactNode } from "react";

import Home from "@/components/home/home";
import CreateUserWindow from "@/components/windows/user/create";
import { getMyProfile } from "@/lib/api/requests";
import { getAccessToken } from "@/lib/auth/cookies";
import { cookies } from "next/headers";

export default async function HomeLayout({ children }: { children: ReactNode }) {
    const accessToken = getAccessToken(await cookies());

    const profileRes = await getMyProfile(accessToken);

    if (!profileRes.user) {
        return (
            <div className="animate-fade-in grid w-svw h-svh">
                <CreateUserWindow email={profileRes.email} />
            </div>
        )
    }

    //const ticketRes = await getTicket(accessToken);

    return (
        <Home user={profileRes.user} ticketRes={{ ticket: '' }}>
            {children}
        </Home>
    )
}