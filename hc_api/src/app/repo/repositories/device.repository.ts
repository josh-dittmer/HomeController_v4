import { and, eq } from 'drizzle-orm';
import { CreateDeviceRequestT, DeviceArrayT, DeviceT } from 'hc_models/models';
import { cast } from 'hc_models/util';
import { UUID } from 'io-ts-types';
import { devicesTable } from '../../../../drizzle/schema.js';
import { generateDeviceSecret, hashSecret, verifySecret } from '../../../lib/secret.js';
import { DBService } from '../../db/services/db.service.js';

export class DeviceRepository {
    constructor(private readonly db: DBService) { }

    async getAll(userId: string): Promise<DeviceArrayT> {
        const devices = await this.db.get()
            .select({
                deviceId: devicesTable.deviceId,
                type: devicesTable.type,
                name: devicesTable.name,
                description: devicesTable.description,
            })
            .from(devicesTable)
            .where(eq(devicesTable.userId, userId));

        return devices.map((device) => ({
            ...device,
            deviceId: cast(UUID)(device.deviceId)
        }))
    }

    async getOne(userId: string, deviceId: string): Promise<DeviceT | null> {
        const devices = await this.db.get()
            .select({
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

        return {
            ...devices[0],
            deviceId: cast(UUID)(devices[0].deviceId)
        }
    }

    async create(
        userId: string,
        data: CreateDeviceRequestT,
    ): Promise<{ id: UUID; secret: string }> {
        const id = crypto.randomUUID() as UUID;
        const secret = generateDeviceSecret();

        const device: typeof devicesTable.$inferInsert = {
            deviceId: id,
            secretHash: await hashSecret(secret),
            userId: userId,
            name: data.name,
            description: data.description,
            type: data.type,
        };

        await this.db.get().insert(devicesTable).values([device]);

        return { id, secret };
    }

    async edit(
        userId: string,
        deviceId: string,
        data: Partial<typeof devicesTable.$inferInsert>,
    ): Promise<number> {
        const qr = await this.db.get()
            .update(devicesTable)
            .set(data)
            .where(and(eq(devicesTable.deviceId, deviceId), eq(devicesTable.userId, userId)));

        return qr.rowCount || 0;
    }

    async delete(userId: string, deviceId: string): Promise<number> {
        const qr = await this.db.get()
            .delete(devicesTable)
            .where(and(eq(devicesTable.deviceId, deviceId), eq(devicesTable.userId, userId)));

        return qr.rowCount || 0;
    }

    async checkSecret(deviceId: string, secret: string): Promise<UUID> {
        const devices = await this.db.get()
            .select({
                deviceId: devicesTable.deviceId,
                userId: devicesTable.userId,
                secretHash: devicesTable.secretHash,
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

        return cast(UUID)(devices[0].userId);
    }
}
