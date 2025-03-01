import { Injectable } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '../../../lib/common/values.js';

@Injectable()
export class DBService {
    private db: NodePgDatabase;

    constructor() {
        this.db = drizzle(DATABASE_URL);
    }

    get() {
        return this.db;
    }

    static register() {
        return {
            provide: DBService,
            useFactory: () => {
                return new DBService();
            },
        };
    }
}
