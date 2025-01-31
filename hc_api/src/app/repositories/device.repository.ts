import { and, eq } from "drizzle-orm";
import { CreateDeviceRequestT, DeviceArrayT, DeviceT } from "hc_models/models";
import { db } from "../../db/db.js";
import { devicesTable } from "../../db/schema.js";
import { generateDeviceSecret, hashSecret, verifySecret } from "../../util/secret.js";

export class DeviceRepository {
    async getAll(userId: string): Promise<DeviceArrayT> {
        const devices: DeviceArrayT = await db.select({
            deviceId: devicesTable.deviceId,
            type: devicesTable.type,
            name: devicesTable.name,
            description: devicesTable.description,
        })
            .from(devicesTable)
            .where(eq(devicesTable.userId, userId));

        return devices;
    }

    async getOne(userId: string, deviceId: string): Promise<DeviceT | null> {
        const devices: DeviceArrayT = await db.select({
            deviceId: devicesTable.deviceId,
            type: devicesTable.type,
            name: devicesTable.name,
            description: devicesTable.description,
        })
            .from(devicesTable)
            .where(and(eq(devicesTable.userId, userId), eq(devicesTable.deviceId, deviceId)));

        if (devices.length === 0) {
            return null;
        }

        return devices[0];
    }

    async create(userId: string, data: CreateDeviceRequestT): Promise<{ id: string, secret: string }> {
        const id = crypto.randomUUID();
        const secret = generateDeviceSecret();

        const device: typeof devicesTable.$inferInsert = {
            deviceId: id,
            secretHash: await hashSecret(secret),
            userId: userId,
            name: data.name,
            description: data.description,
            type: data.type
        };

        await db.insert(devicesTable).values([device]);

        return { id, secret };
    };

    async edit(userId: string, deviceId: string, data: Partial<typeof devicesTable.$inferInsert>): Promise<number> {
        const qr = await db.update(devicesTable)
            .set(data)
            .where(and(eq(devicesTable.deviceId, deviceId), eq(devicesTable.userId, userId)));

        return qr.rowCount || 0;
    }

    async delete(userId: string, deviceId: string): Promise<number> {
        const qr = await db.delete(devicesTable)
            .where(and(eq(devicesTable.deviceId, deviceId), eq(devicesTable.userId, userId)));

        return qr.rowCount || 0;
    }

    async checkSecret(deviceId: string, secret: string): Promise<string> {
        const devices = await db.select({
            deviceId: devicesTable.deviceId,
            userId: devicesTable.userId,
            secretHash: devicesTable.secretHash
        })
            .from(devicesTable)
            .where(eq(devicesTable.deviceId, deviceId));

        if (devices.length === 0) {
            throw new Error('device not found');
        }

        const valid = await verifySecret(secret, devices[0].secretHash);

        if (!valid) {
            throw new Error('bad device secret');
        }

        return devices[0].userId;
    }
}