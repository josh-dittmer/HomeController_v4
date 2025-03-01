import { drizzle } from 'drizzle-orm/node-postgres';

export function createDb(url: string) {
    return drizzle(url);
}
