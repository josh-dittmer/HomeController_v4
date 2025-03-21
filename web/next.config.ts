import { Endpoints } from "@/lib/api/endpoints";
import type { NextConfig } from "next";
import path from 'node:path';

const nextConfig: NextConfig = {
    /* config options here */
    outputFileTracingRoot: process.env.NODE_ENV === 'development' ? path.join(__dirname, '../../') : undefined,
    output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

    rewrites: async () => {
        return [
            {
                source: '/api/:path*',
                destination: `${Endpoints.mainApiInternalUrl}/api/:path*`
            }
        ]
    }
};

export default nextConfig;
