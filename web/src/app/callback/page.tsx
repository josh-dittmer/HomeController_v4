'use client';

import LoadingSpinner from "@/components/loading_spinner/loading_spinner";
import { handleCallback } from "@/lib/auth/actions";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const code = searchParams.get('code');
    const newState = searchParams.get('state');

    const { isLoading, isSuccess, isError } = useQuery({
        queryKey: ['callback'],
        queryFn: () => {
            const storedState = sessionStorage.getItem('state');
            const storedVerifier = sessionStorage.getItem('verifier');

            sessionStorage.removeItem('state');
            sessionStorage.removeItem('verifier');

            return handleCallback(code, newState, storedState, storedVerifier);
        },
        staleTime: Infinity,
        retry: false
    });

    useEffect(() => {
        if (isSuccess) {
            router.push('/home');
        }
    }, [router, isSuccess]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex flex-col justify-center items-center h-screen w-screen">
                <p className="text-fg-light">Something went wrong!</p>
                <p className="text-fg-light underline"><Link href="/login">Try Again</Link></p>
            </div>
        )
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <LoadingSpinner />
        </div>
    )
}