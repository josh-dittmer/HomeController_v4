'use client';

import LoadingSpinner from "@/components/loading_spinner/loading_spinner";
import { createLoginUrl } from "@/lib/auth/actions";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const searchParams = useSearchParams();

    const clearSession = searchParams.get('clear_session') === '1';

    const { data, isSuccess } = useQuery({
        queryKey: ['login'],
        queryFn: () => createLoginUrl(clearSession),
        staleTime: Infinity,
        retry: false
    });

    useEffect(() => {
        if (isSuccess && data) {
            sessionStorage.setItem('state', data.state);
            sessionStorage.setItem('verifier', data.verifier);

            window.location.href = data.url;
        }
    }, [data, isSuccess]);

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <LoadingSpinner text="Redirecting to Joth..." />
        </div>
    )
}