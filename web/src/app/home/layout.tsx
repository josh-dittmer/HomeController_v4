import { ReactNode } from "react";

import Home from "@/components/home/home";
import { getMyProfile } from "@/lib/api/actions";

export default async function HomeLayout({ children }: { children: ReactNode }) {
    const user = await getMyProfile();

    return (
        <Home res={user}>
            {children}
        </Home>
    )
}