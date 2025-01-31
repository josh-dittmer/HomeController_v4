import 'dotenv/config';

export const DATABASE_URL = process.env.DATABASE_URL!;

export const API_PREFIX = '/api/v1';
export const API_PORT = process.env.API_PORT!;

export const CORS_ALLOWED_ORIGIN = process.env.CORS_ALLOWED_ORIGIN!;

export const LOG_LEVEL = process.env.LOG_LEVEL!;

export const TICKET_LIFETIME = Number.parseInt(process.env.TICKET_LIFETIME!);
