import { drizzle } from "drizzle-orm/node-postgres";
import { DATABASE_URL } from '../common/values.js';

export const db = drizzle(DATABASE_URL);