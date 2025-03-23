'use client';

import LoadingSpinner from "@/components/loading_spinner/loading_spinner";
import { test } from "./actions";

export default function TestPage() {
    return (
        <>
            <LoadingSpinner />
            <div className="md:bg-green-300 w-32 h-32"></div>
            <button
                onClick={() => test()}
                className="bg-green-500"
            >
                TEST
            </button>
        </>
    )
}