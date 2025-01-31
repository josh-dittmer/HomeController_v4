import { generateDeviceSecret, hashSecret } from "../util/secret.js";
import { db } from "./db.js";
import { devicesTable, usersTable } from "./schema.js";

async function seedTest() {
    try {
        console.log('Seeding...');

        await db.delete(devicesTable);
        await db.delete(usersTable);

        console.log('Cleared database. Inserting...');

        const user1Id = 'dd74961a-c348-4471-98a5-19fc3c5b5079';

        const users: Array<typeof usersTable.$inferInsert> = [
            {
                userId: user1Id,
                name: 'Test User',
            }
        ];

        const device1Id = '21a6058f-a97e-4a2e-8deb-aa1c4ff5d235';

        const device1Secret = generateDeviceSecret();
        console.log(`DEVICE 1 SECRET: ${device1Secret}`);

        const devices: Array<typeof devicesTable.$inferInsert> = [
            {
                deviceId: device1Id,
                secretHash: await hashSecret(device1Secret),
                userId: user1Id,
                name: 'Test Device',
                description: 'This is a test device',
                type: 'test_device'
            }
        ];

        await db.insert(usersTable).values(users);
        await db.insert(devicesTable).values(devices);

        console.log('Finished seeding.');
    } catch (err) {
        console.log(`Error: ${err}`);
        console.log('Seeding failed!');
    }
}

seedTest();