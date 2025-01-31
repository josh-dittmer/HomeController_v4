export const Endpoints = {
    authApiPublicUrl: `${process.env.NEXT_PUBLIC_AUTH_API_PUBLIC_URL!}`,
    authApiInternalUrl: `${process.env.NEXT_PUBLIC_AUTH_API_INTERNAL_URL!}`,
    authApiPrefix: `${process.env.NEXT_PUBLIC_AUTH_API_PREFIX!}`,
    authApiPublic: `${process.env.NEXT_PUBLIC_AUTH_API_PUBLIC_URL!}${process.env.NEXT_PUBLIC_AUTH_API_PREFIX!}`,
    authApiInternal: `${process.env.NEXT_PUBLIC_AUTH_API_INTERNAL_URL!}${process.env.NEXT_PUBLIC_AUTH_API_PREFIX!}`,

    mainApiUrl: `${process.env.NEXT_PUBLIC_MAIN_API_URL!}`,
    mainApiPrefix: `${process.env.NEXT_PUBLIC_MAIN_API_PREFIX!}`,
    mainApi: `${process.env.NEXT_PUBLIC_MAIN_API_URL!}${process.env.NEXT_PUBLIC_MAIN_API_PREFIX!}`,

    callbackUrl: `${process.env.SELF_URL!}/callback`
};

export const ClientId = process.env.CLIENT_ID!;