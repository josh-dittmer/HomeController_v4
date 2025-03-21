import { ReactNode } from "react";

import Home from "@/components/home/home";

export default async function HomeLayout({ children }: { children: ReactNode }) {
    return (
        <Home>
            {children}
        </Home>
    )
}