import { Injectable, Logger, Provider } from "@nestjs/common";
import { HCGatewayModels } from "hc_models/models";
import { UUID } from "io-ts-types";
import { WrapperType } from "../../../../lib/common/types.js";
import { DeviceGateway } from "../gateways/device.gateway.js";

@Injectable()
export class DeviceService {
    private readonly logger = new Logger('DeviceService');

    constructor(
        private readonly gateway: WrapperType<DeviceGateway>
    ) { }

    async getOnlineDevices(userId: string): Promise<Set<string>> {
        const sockets = await this.gateway.server.in(`owner_${userId}`).fetchSockets();

        const devices: Set<string> = new Set<string>();
        sockets.forEach((socket) => {
            if (!socket.data.device) {
                this.logger.debug('getOnlineDevices(): Incorrect socket type!');
                return;
            }

            devices.add(socket.data.device.id);
        });

        return devices;
    }

    async isDeviceOnline(userId: UUID, deviceId: UUID): Promise<boolean> {
        const sockets = await this.gateway.server.in(`owner_${userId}`).fetchSockets();

        if (sockets.length === 0) {
            return false;
        }

        return sockets.some((socket) => {
            if (!socket.data.device) {
                this.logger.debug('isDeviceOnline(): Incorrect socket type!');
                return false;
            }

            return socket.data.device.id === deviceId;
        });
    }

    async getDeviceSocket(deviceId: UUID) {
        const sockets = await this.gateway.server.in(`device_${deviceId}`).fetchSockets();

        if (sockets.length !== 1) {
            this.logger.debug(`getDeviceSocket(): Invalid/offline device`,);
            return null;
        }

        if (!sockets[0].data.device) {
            this.logger.debug('getDeviceSocket(): Incorrect socket type! (expected device)');
            return null;
        }

        return sockets[0];
    }

    async getDevice(userId: UUID, deviceId: UUID): Promise<HCGatewayModels.Device.SocketDataT | null> {
        const socket = await this.getDeviceSocket(deviceId);
        if (!socket) {
            return null;
        }

        const device = socket.data.device;
        if (!device) {
            return null;
        }

        if (device.owner !== userId) {
            this.logger.debug('getDevice(): Disallowed device');
            return null;
        }

        return socket.data.device;
    }

    async requestState(deviceId: UUID, request: HCGatewayModels.Device.StateRequestDataT) {
        this.gateway.server
            .in(`device_${deviceId}`)
            .emit('stateRequest', request);
    }

    async sendCommand(userId: UUID, deviceId: UUID, request: HCGatewayModels.Device.CommandRequestDataT) {
        const device = await this.getDevice(userId, deviceId);
        if (!device) {
            return;
        }

        this.gateway.server
            .in(`device_${device.id}`)
            .emit('commandRequest', request);

        this.logger.verbose(`[commandRequest] -> [device/${device.id}]`);
    }

    async sendDeviceDeletedNotification(userId: UUID, deviceId: UUID, notification: HCGatewayModels.Device.DeviceDeletedNotificationDataT) {
        const device = await this.getDevice(userId, deviceId);
        if (!device) {
            return;
        }

        this.gateway.server
            .in(`device_${device.id}`)
            .emit('deviceDeletedNotification', notification);

        this.logger.verbose(`[deviceDeletedNotification] -> [device/${device.id}]`);

    }

    static register(): Provider {
        return {
            provide: DeviceService,
            useFactory: (gateway: DeviceGateway) => {
                return new DeviceService(gateway);
            },
            inject: [DeviceGateway],
        }
    }
}