import { eq } from "drizzle-orm";
import { CreateUserRequestT, UserArrayT, UserT } from "hc_models/models";
import { db } from "../../db/db.js";
import { usersTable } from "../../db/schema.js";

export class UserRepository {
    async getOne(userId: string): Promise<UserT | null> {
        const users: UserArrayT = await db.select({
            userId: usersTable.userId,
            name: usersTable.name
        })
            .from(usersTable)
            .where(eq(usersTable.userId, userId));

        if (users.length === 0) {
            return null;
        }

        return users[0];
    }

    async create(userId: string, data: CreateUserRequestT) {
        const user: typeof usersTable.$inferInsert = {
            userId: userId,
            name: data.name
        };

        await db.insert(usersTable).values([user]);
    }

    async edit(userId: string, data: Partial<typeof usersTable.$inferInsert>): Promise<number> {
        const qr = await db.update(usersTable)
            .set(data)
            .where(eq(usersTable.userId, userId));

        return qr.rowCount || 0;
    }
}