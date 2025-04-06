import { forwardRef, Inject, Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { HCGatewayModels } from "hc_models/models";
import { HCServer, HCServerSocket } from "hc_models/types";
import { cast } from "hc_models/util";
import { DeviceStateResponseTimeout } from "hc_models/values";
import { API_PREFIX, CORS_ALLOWED_ORIGIN, USER_NAMESPACE } from "../../../../lib/common/values.js";
import { RepoService } from "../../../repo/services/repo.service.js";
import { DeviceService } from "../../device/services/device.service.js";
import { userMiddleware } from "../middleware/user.middleware.js";

@WebSocketGateway({
    path: `${API_PREFIX}/gateway`,
    namespace: USER_NAMESPACE,
    cors: {
        origin: CORS_ALLOWED_ORIGIN
    }
})
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: HCServer;

    private readonly logger = new Logger('UserGateway');

    constructor(
        @Inject()
        private readonly repo: RepoService,

        @Inject(forwardRef(() => DeviceService))
        private readonly deviceService: DeviceService
    ) { }

    async afterInit(server: HCServer) {
        this.server.use(userMiddleware(server, this.repo, this.logger));
    }

    async handleConnection(socket: HCServerSocket) {
        if (!socket.data.user) {
            this.logger.debug('handleConnection(): Incorrect socket type!');
            return;
        }

        const user = socket.data.user;

        socket.join(`user_${user.id}`);

        this.logger.log(`[user/${user.id}] has connected`);
    }

    async handleDisconnect(socket: HCServerSocket) {

    }

    @SubscribeMessage('stateRequest')
    async handleStateRequest(@ConnectedSocket() socket: HCServerSocket, @MessageBody() data: unknown): Promise<HCGatewayModels.User.StateResponseDataT> {
        if (!socket.data.user) {
            this.logger.debug('handleStateRequest(): Incorrect socket type! (expected user)');
            return { state: null };
        }

        const user = socket.data.user;

        const request = cast(HCGatewayModels.User.StateRequestData)(data);

        const device = await this.deviceService.getDevice(user.id, request.deviceId);
        if (!device) {
            return { state: null };
        }

        return await new Promise((resolve) => {
            let timedOut = false;

            const timeout = setTimeout(() => {
                timedOut = true;
                this.logger.debug(`handleStateRequest(): [device/${device.id}] timed out`);
                resolve({ state: null });
            }, DeviceStateResponseTimeout);

            user.queue.push((state: unknown) => {
                if (!timedOut) {
                    clearTimeout(timeout);

                    this.logger.verbose(`[stateResponse] -> [user/${user.id}]`);
                    resolve({ state: state });
                } else {
                    this.logger.debug(`handleStateRequest(): [device/${device.id}] received after timeout`);
                }
            })

            this.logger.verbose(`[stateRequest] -> [device/${device.id}]`);

            this.deviceService.requestState(device.id, {
                socketId: socket.id
            });
        });
    }

    @SubscribeMessage('commandRequest')
    async handleCommandRequest(@ConnectedSocket() socket: HCServerSocket, @MessageBody() data: unknown): Promise<void> {
        if (!socket.data.user) {
            this.logger.debug('handleCommandRequest(): Incorrect socket type! (expected user)');
            return;
        }

        const user = socket.data.user;

        const request = cast(HCGatewayModels.User.CommandRequestData)(data);

        this.deviceService.sendCommand(user.id, request.deviceId, { data: request.data });
    }
}