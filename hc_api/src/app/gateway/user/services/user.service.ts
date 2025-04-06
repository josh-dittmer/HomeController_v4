import { Injectable, Logger, Provider } from "@nestjs/common";
import { HCGatewayModels } from "hc_models/models";
import { UUID } from "io-ts-types";
import { WrapperType } from "../../../../lib/common/types.js";
import { UserGateway } from "../gateways/user.gateway.js";

@Injectable()
export class UserService {
    private readonly logger = new Logger('UserService');

    constructor(
        private readonly gateway: WrapperType<UserGateway>
    ) { }

    async getUser(socketId: string): Promise<HCGatewayModels.User.SocketDataT | null> {
        const sockets = await this.gateway.server.in(socketId).fetchSockets();

        if (sockets.length !== 1) {
            this.logger.debug('getUser(): Bad socket ID, may have disconnected');
            return null;
        }

        if (!sockets[0].data.user) {
            this.logger.debug('getUser(): Incorrect socket type! (expected user)');
            return null;
        }

        return sockets[0].data.user;
    }

    async sendDeviceConnectedNotification(userId: UUID, notification: HCGatewayModels.User.DeviceConnectedNotificationDataT) {
        this.gateway.server
            .in(`user_${userId}`)
            .emit('deviceConnectedNotification', notification);
    }

    async sendDeviceDisonnectedNotification(userId: UUID, notification: HCGatewayModels.User.DeviceDisconnectedNotificationDataT) {
        this.gateway.server
            .in(`user_${userId}`)
            .emit('deviceDisconnectedNotification', notification);
    }

    async sendStateChangedNotification(userId: UUID, notification: HCGatewayModels.User.StateChangedNotifcationDataT) {
        this.gateway.server
            .in(`user_${userId}`)
            .emit('stateChangedNotification', notification);
    }

    static register(): Provider {
        return {
            provide: UserService,
            useFactory: (gateway: UserGateway) => {
                return new UserService(gateway);
            },
            inject: [UserGateway]
        }
    }
}