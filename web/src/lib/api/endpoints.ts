export const Endpoints = {
    authApiPublicUrl: `${process.env.NEXT_PUBLIC_AUTH_API_PUBLIC_URL!}`,
    authApiInternalUrl: `${process.env.NEXT_PUBLIC_AUTH_API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_AUTH_API_PUBLIC_URL!}`,
    authApiPrefix: `${process.env.NEXT_PUBLIC_AUTH_API_PREFIX!}`,
    authApiPublic: `${process.env.NEXT_PUBLIC_AUTH_API_PUBLIC_URL!}${process.env.NEXT_PUBLIC_AUTH_API_PREFIX!}`,
    authApiInternal: `${process.env.NEXT_PUBLIC_AUTH_API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_AUTH_API_PUBLIC_URL!}${process.env.NEXT_PUBLIC_AUTH_API_PREFIX!}`,

    mainApiPublicUrl: `${process.env.NEXT_PUBLIC_MAIN_API_PUBLIC_URL!}`,
    mainApiInternalUrl: `${process.env.NEXT_PUBLIC_MAIN_API_INTERNAL_URL!}`,
    mainApiPrefix: `${process.env.NEXT_PUBLIC_MAIN_API_PREFIX!}`,
    mainApiPublic: `${process.env.NEXT_PUBLIC_MAIN_API_PUBLIC_URL!}${process.env.NEXT_PUBLIC_MAIN_API_PREFIX!}`,
    mainApiInternal: `${process.env.NEXT_PUBLIC_MAIN_API_INTERNAL_URL!}${process.env.NEXT_PUBLIC_MAIN_API_PREFIX!}`,

    callbackUrl: `${process.env.NEXT_PUBLIC_SELF_URL!}/callback`
};

export const ClientId = process.env.NEXT_PUBLIC_CLIENT_ID!;