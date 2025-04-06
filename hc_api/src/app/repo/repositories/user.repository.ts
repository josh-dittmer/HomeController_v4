import { eq } from 'drizzle-orm';
import { CreateUserRequestT, UserT } from 'hc_models/models';
import { usersTable } from '../../../../drizzle/schema.js';
import { validateUUID } from '../../../lib/uuid.js';
import { DBService } from '../../db/services/db.service.js';

export class UserRepository {
    constructor(private readonly db: DBService) { }

    async getOne(userId: string): Promise<UserT | null> {
        const users = await this.db
            .get()
            .select({
                userId: usersTable.userId,
                name: usersTable.name,
            })
            .from(usersTable)
            .where(eq(usersTable.userId, userId));

        if (users.length === 0) {
            return null;
        }

        return {
            ...users[0],
            userId: validateUUID(users[0].userId)
        };
    }

    async create(userId: string, data: CreateUserRequestT) {
        const user: typeof usersTable.$inferInsert = {
            userId: userId,
            name: data.name,
        };

        await this.db.get().insert(usersTable).values([user]);
    }

    async edit(userId: string, data: Partial<typeof usersTable.$inferInsert>): Promise<number> {
        const qr = await this.db
            .get()
            .update(usersTable)
            .set(data)
            .where(eq(usersTable.userId, userId));

        return qr.rowCount || 0;
    }
}
