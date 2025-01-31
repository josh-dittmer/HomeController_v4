import bcrypt from 'bcryptjs';
import { DeviceSecretNumBytes, TicketNumBytes } from 'hc_models/values';
import { randomBytes } from 'node:crypto';

export function generateDeviceSecret(): string {
    const bytes = randomBytes(DeviceSecretNumBytes);
    return bytes.toString('hex');
}

export function generateUserTicket(): string {
    const bytes = randomBytes(TicketNumBytes);
    return bytes.toString('hex');
}

export async function hashSecret(secret: string): Promise<string> {
    return await bcrypt.hash(secret, 11);
}

export async function verifySecret(secret: string, secretHash: string): Promise<boolean> {
    return await bcrypt.compare(secret, secretHash);
}