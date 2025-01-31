import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { ClientToServerEvents, DeviceCheckStateReplyData, DeviceStateChangedData, InterServerEvents, ServerToClientEvents, SocketData, UserCheckStateReplyData, UserCheckStateRequestData, UserCommandData } from "hc_models/types";
import { Namespace, Server, Socket } from "socket.io";
import { API_PREFIX, CORS_ALLOWED_ORIGIN } from "../../common/values.js";
import { HCService } from "../../hc/hc.service.js";
import { authMiddleware } from "./auth.js";

export type HCGatewayServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type HCGatewayNamespace = Namespace<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type HCGatewaySocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

@WebSocketGateway({
    path: `${API_PREFIX}/gateway`,
    cors: {
        origin: CORS_ALLOWED_ORIGIN
    }
})
export class HCGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server!: HCGatewayServer;

    private namespace = () => this.server.of('/');

    private readonly logger = new Logger('Gateway');

    constructor(private readonly hc: HCService) { }

    async afterInit(server: Server) {
        server.use(authMiddleware(this.hc, this.namespace, this.logger));
    }

    async handleConnection(socket: HCGatewaySocket) {
        switch (socket.data.type) {
            case 'user':
                this.handleUserConnect(socket);
                break;
            case 'device':
                this.handleDeviceConnect(socket);
                break;
        }
    }

    async handleDisconnect(socket: HCGatewaySocket) {
        switch (socket.data.type) {
            case 'user':
                this.handleUserDisconnect(socket);
                break;
            case 'device':
                this.handleDeviceDisconnect(socket);
                break;
        }
    }

    async getOnlineDevices(userId: string): Promise<Set<string>> {
        const sockets = await this.namespace().in(`owner_${userId}`).fetchSockets();

        const devices: Set<string> = new Set<string>();
        sockets.forEach((socket) => {
            if (socket.data.deviceId) {
                devices.add(socket.data.deviceId)
            }
        });

        return devices;
    }

    async isDeviceOnline(userId: string, deviceId: string): Promise<boolean> {
        const sockets = await this.namespace().in(`owner_${userId}`).fetchSockets();

        if (sockets.length === 0) {
            return false;
        }

        const socket = sockets[0];

        if (!socket.rooms.has(`device_${deviceId}`)) {
            return false;
        }

        return true;
    };

    async sendDeleteEvent(userId: string, deviceId: string) {
        const sockets = await this.namespace().in(`owner_${userId}`).fetchSockets();

        if (sockets.length === 0) {
            this.logger.warn('Tried to send delete event to nonexistent device');
            return;
        }

        const socket = sockets[0];

        if (!socket.rooms.has(`device_${deviceId}`)) {
            this.logger.warn('Tried to send delete event to device not owned by user');
            return;
        }

        socket.emit('deviceDeleted');
        //sockets[0].disconnect(true);
    }

    @SubscribeMessage('test')
    async handleTest() {
        return 'test';
    }

    @SubscribeMessage('userCheckStateRequest')
    async handleCheckStateRequest(@ConnectedSocket() socket: HCGatewaySocket, @MessageBody() msg: UserCheckStateRequestData): Promise<UserCheckStateReplyData> {
        const deviceId = msg.deviceId;

        const sockets = await this.server.in(`device_${deviceId}`).fetchSockets();

        if (sockets.length === 0) {
            this.logger.debug(`Received userCheckStateReply from [user/${socket.data.userId}] for invalid/offline device`);
            return { data: null };
        }

        const deviceSocket = sockets[0];

        if (deviceSocket.data.ownerId !== socket.data.userId) {
            this.logger.debug(`Received userCheckStateReply from [user/${socket.data.userId}] for a disallowed device`);
            return { data: null };
        }

        return await new Promise((resolve) => {
            let timedOut = false;

            const timeout = setTimeout(() => {
                timedOut = true;
                this.logger.warn(`State check request to [device/${deviceId}] timed out`);
                resolve({ data: null });
            }, 5000);

            socket.data.checkStateCallbackQueue?.push((data: object) => {
                if (!timedOut) {
                    clearTimeout(timeout);

                    this.logger.verbose(`[deviceCheckStateReply] -> [user/${socket.data.userId}]`);
                    resolve({ data: data });
                } else {
                    this.logger.debug(`State check reply from [device/${deviceId}] received after timeout`);
                }
            });

            this.logger.verbose(`[deviceCheckStateRequest] -> [device/${deviceId}]`);

            this.namespace().in(`device_${deviceId}`).emit('deviceCheckStateRequest', { socketId: socket.id });
        });
    }

    @SubscribeMessage('deviceCheckStateReply')
    async handleCheckStateReply(@ConnectedSocket() socket: HCGatewaySocket, @MessageBody() msg: DeviceCheckStateReplyData) {
        const sockets = await this.server.in(msg.socketId).fetchSockets();

        if (sockets.length !== 1) {
            this.logger.debug('Received [deviceCheckStateReply] for bad socket ID, may have disconnected');
            return;
        }

        const userSocket = sockets[0];

        if (socket.data.ownerId !== userSocket.data.userId) {
            this.logger.debug('Received [deviceCheckStateReply] for disallowed socket ID');
            return;
        }

        const cb = userSocket.data.checkStateCallbackQueue?.shift();

        if (cb) {
            cb(msg.data);
        }
    }

    @SubscribeMessage('userCommand')
    async handleCommand(@ConnectedSocket() socket: HCGatewaySocket, @MessageBody() msg: UserCommandData) {
        const deviceId = msg.deviceId;

        const sockets = await this.server.in(`device_${deviceId}`).fetchSockets();

        if (sockets.length === 0) {
            this.logger.debug(`Received [userCommand] from [user/${socket.data.userId}] for invalid/offline device`);
            return { data: null };
        }

        const deviceSocket = sockets[0];

        if (deviceSocket.data.ownerId !== socket.data.userId) {
            this.logger.debug(`Received [userCommand] from [user/${socket.data.userId}] for a disallowed device`);
            return { data: null };
        }

        this.logger.verbose(`[deviceCommand] -> [device/${deviceId}]`);

        this.namespace().in(`device_${deviceId}`).emit('deviceCommand', { data: msg.data });
    }

    @SubscribeMessage('deviceStateChanged')
    async handleStateChanged(@ConnectedSocket() socket: HCGatewaySocket, @MessageBody() msg: DeviceStateChangedData) {
        const deviceId = socket.data.deviceId;
        const ownerId = socket.data.ownerId;

        if (!deviceId || !ownerId) {
            this.logger.error('Required socket data missing in deviceStateChanged handler');
            return;
        }

        //this.logger.verbose(`[device/${deviceId}] -> [deviceStateChanged]`);

        this.namespace().in(`user_${ownerId}`).emit('userStateChanged', {
            deviceId: deviceId,
            data: msg.data
        });
    }

    private async handleUserConnect(socket: HCGatewaySocket) {
        socket.join(`user_${socket.data.userId}`);

        socket.data.checkStateCallbackQueue = new Array<(reply: object) => void>;

        this.logger.log(`[user/${socket.data.userId}] has connected`);
    }

    private async handleDeviceConnect(socket: HCGatewaySocket) {
        if (socket.data.deviceId && socket.data.ownerId) {
            socket.join(`device_${socket.data.deviceId}`);
            socket.join(`owner_${socket.data.ownerId}`);

            this.namespace().in(`user_${socket.data.ownerId}`).emit('userDeviceConnected', { deviceId: socket.data.deviceId });
        }

        this.logger.verbose(`[device/${socket.data.deviceId}] owned by [user/${socket.data.ownerId}]`);
        this.logger.log(`[device/${socket.data.deviceId}] has connected`);
    }

    private async handleUserDisconnect(socket: HCGatewaySocket) {
        this.logger.log(`[user/${socket.data.userId}] has disconnected`);
    }

    private async handleDeviceDisconnect(socket: HCGatewaySocket) {
        if (socket.data.deviceId && socket.data.ownerId) {
            this.namespace().in(`user_${socket.data.ownerId}`).emit('userDeviceDisconnected', { deviceId: socket.data.deviceId });
        }

        this.logger.log(`[device/${socket.data.deviceId}] has disconnected`);
    }

}