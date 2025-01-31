import { eq } from "drizzle-orm";
import { TICKET_LIFETIME } from "../../common/values.js";
import { db } from "../../db/db.js";
import { ticketsTable } from "../../db/schema.js";
import { generateUserTicket } from "../../util/secret.js";

export class TicketRepository {
    async create(userId: string): Promise<string> {
        const ticketValue = generateUserTicket();

        const ticket: typeof ticketsTable.$inferInsert = {
            userId: userId,
            ticket: ticketValue,
            expiresAt: new Date(Date.now() + TICKET_LIFETIME * 1000)
        }

        await db.insert(ticketsTable).values([ticket]);

        return ticketValue;
    }

    async consume(ticketValue: string): Promise<string> {
        const ticketResult = await db.select({
            ticketId: ticketsTable.ticketId,
            userId: ticketsTable.userId,
            ticket: ticketsTable.ticket,
            expiresAt: ticketsTable.expiresAt
        })
            .from(ticketsTable)
            .where(eq(ticketsTable.ticket, ticketValue));

        const deleteTicket
            = async () => await db.delete(ticketsTable).where(eq(ticketsTable.ticketId, res.ticketId));

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