import { eq } from 'drizzle-orm';
import { ticketsTable } from '../../../../drizzle/schema.js';
import { TICKET_LIFETIME } from '../../../lib/common/values.js';
import { generateUserTicket } from '../../../lib/secret.js';
import { DBService } from '../../db/services/db.service.js';
export class TicketRepository {
    constructor(private readonly db: DBService) {}

    async create(userId: string): Promise<string> {
        const ticketValue = generateUserTicket();

        const ticket: typeof ticketsTable.$inferInsert = {
            userId: userId,
            ticket: ticketValue,
            expiresAt: new Date(Date.now() + TICKET_LIFETIME * 1000),
        };

        await this.db.get().insert(ticketsTable).values([ticket]);

        return ticketValue;
    }

    async consume(ticketValue: string): Promise<string> {
        const ticketResult = await this.db
            .get()
            .select({
                ticketId: ticketsTable.ticketId,
                userId: ticketsTable.userId,
                ticket: ticketsTable.ticket,
                expiresAt: ticketsTable.expiresAt,
            })
            .from(ticketsTable)
            .where(eq(ticketsTable.ticket, ticketValue));

        const deleteTicket = async () =>
            await this.db.get().delete(ticketsTable).where(eq(ticketsTable.ticketId, res.ticketId));

        if (ticketResult.length === 0) {
            await deleteTicket();
            throw new Error('ticket not found');
        }

        const res = ticketResult[0];

        if (Date.now() >= res.expiresAt.getTime()) {
            await deleteTicket();
            throw new Error('ticket expired');
        }

        return res.userId;
    }
}
