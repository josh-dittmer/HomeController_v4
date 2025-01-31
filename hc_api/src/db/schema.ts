import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { DeviceSecretNumBytes, DeviceType, MaxDeviceDescriptionLength, MaxDeviceNameLength, MaxUserNameLength, TicketNumBytes } from 'hc_models/values';

export const usersTable = pgTable('users', {
    userId: uuid().unique().notNull().primaryKey().$default(() => crypto.randomUUID()),
    name: varchar({ length: MaxUserNameLength }).notNull()
});

const deviceTypes = DeviceType.types.map((type) => type.value) as [string, ...string[]];
export const deviceTypeEnum = pgEnum('device_type', deviceTypes);

export const devicesTable = pgTable('devices', {
    deviceId: uuid().unique().notNull().primaryKey().$default(() => crypto.randomUUID()),
    secretHash: varchar({ length: DeviceSecretNumBytes * 2 }).notNull(),
    userId: uuid().notNull().references(() => usersTable.userId, { onDelete: 'cascade' }),
    name: varchar({ length: MaxDeviceNameLength }).notNull(),
    description: varchar({ length: MaxDeviceDescriptionLength }).notNull(),
    type: deviceTypeEnum().notNull()
});

export const ticketsTable = pgTable('tickets', {
    ticketId: uuid().unique().notNull().primaryKey().$default(() => crypto.randomUUID()),
    userId: uuid().notNull().references(() => usersTable.userId, { onDelete: 'cascade' }),
    ticket: varchar({ length: TicketNumBytes * 2 }).unique().notNull(),
    expiresAt: timestamp().notNull()
});