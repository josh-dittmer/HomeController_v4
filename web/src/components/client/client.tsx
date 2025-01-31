'use client';

import { ThemeProvider } from "@/contexts/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Client({ children }: { children: ReactNode }) {
    const [queryClient] = useState(new QueryClient());

    return (
        <ThemeProvider defaultTheme="dark">
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </ThemeProvider>
    )
}