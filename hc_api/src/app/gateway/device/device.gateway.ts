import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { API_PREFIX, CORS_ALLOWED_ORIGIN } from "../../../lib/common/values.js";

@WebSocketGateway({
    path: `${API_PREFIX}/gateway`,
    namespace: 'device',
    cors: {
        origin: CORS_ALLOWED_ORIGIN
    }
})
export class DeviceGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    async afterInit(server: Server) {

    }

    async handleConnection(socket: Socket) {

    }

    async handleDisconnect(socket: Socket) {

    }
}