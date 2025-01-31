declare global {
    declare module 'express-serve-static-core' {
        interface Locals {
            userId: string,
            userEmail: string
        }
    }
}