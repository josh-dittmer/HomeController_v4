import { forwardRef, Inject, Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { HCGatewayModels } from "hc_models/models";
import { HCServer, HCServerSocket } from "hc_models/types";
import { cast } from "hc_models/util";
import { WrapperType } from "../../../../lib/common/types.js";
import { API_PREFIX, CORS_ALLOWED_ORIGIN, DEVICE_NAMESPACE } from "../../../../lib/common/values.js";
import { RepoService } from "../../../repo/services/repo.service.js";
import { UserService } from "../../user/services/user.service.js";
import { deviceMiddleware } from "../middleware/device.middleware.js";

@WebSocketGateway({
    path: `${API_PREFIX}/gateway`,
    namespace: DEVICE_NAMESPACE,
    cors: {
        origin: CORS_ALLOWED_ORIGIN
    }
})
export class DeviceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: HCServer;

    private readonly logger = new Logger('DeviceGateway');

    constructor(
        @Inject()
        private readonly repo: RepoService,

        @Inject(forwardRef(() => UserService))
        private readonly userService: WrapperType<UserService>
    ) { }

    async afterInit(server: HCServer) {
        this.server.use(deviceMiddleware(server, this.repo, this.logger));
    }

    async handleConnection(socket: HCServerSocket) {
        if (!socket.data.device) {
            this.logger.debug('handleConnection(): Incorrect socket type!');
            return;
        }

        const device = socket.data.device;

        socket.join(`device_${device.id}`);
        socket.join(`owner_${device.owner}`);

        this.userService.sendDeviceConnectedNotification(device.owner, {
            deviceId: device.id
        });

        this.logger.verbose(`[device/${device.id}] owned by [user/${device.owner}]`);
        this.logger.log(`[device/${device.id}] has connected`);
    }

    async handleDisconnect(socket: HCServerSocket) {
        if (!socket.data.device) {
            this.logger.debug('handleDisconnect(): Incorrect socket type!');
            return;
        }

        const device = socket.data.device;

        this.userService.sendDeviceDisonnectedNotification(device.owner, {
            deviceId: device.id
        });

        this.logger.log(`[device/${device.id}] has disconnected`);
    }

    @SubscribeMessage('stateResponse')
    async handleStateResponse(@ConnectedSocket() socket: HCServerSocket, @MessageBody() data: unknown): Promise<void> {
        if (!socket.data.device) {
            this.logger.debug('handleStateResponse(): Incorrect socket type!');
            return;
        }

        const device = socket.data.device;

        const response = cast(HCGatewayModels.Device.StateResponseData)(data);

        const user = await this.userService.getUser(response.socketId);
        if (!user) {
            return;
        }

        if (user.id !== device.owner) {
            this.logger.debug('handleStateResponse(): Disallowed socket ID!');
            return;
        }

        const cb = user.queue.shift();
        if (cb) {
            cb(response.data);
        }
    }

    @SubscribeMessage('stateChangedNotification')
    async handleStateChangedNotification(@ConnectedSocket() socket: HCServerSocket, @MessageBody() data: unknown): Promise<void> {
        if (!socket.data.device) {
            this.logger.debug('handleStateChangedNotification(): Incorrect socket type!');
            return;
        }

        const device = socket.data.device;

        const notification = cast(HCGatewayModels.Device.StateChangeNotificationData)(data);

        this.userService.sendStateChangedNotification(device.owner, {
            deviceId: device.id,
            data: notification.data
        });
    }
}