import { Logger } from "@nestjs/common";
import { isLeft } from "fp-ts/lib/Either.js";
import { ClientType, ClientTypeT } from "hc_models/values";
import { ExtendedError } from "socket.io";
import { HCService } from "../../hc/hc.service.js";
import { HCGatewayNamespace, HCGatewaySocket } from "./gateway.js";

export const authMiddleware = (hc: HCService, namespace: () => HCGatewayNamespace, logger: Logger) => (
    async (socket: HCGatewaySocket, next: (err?: ExtendedError) => void) => {
        if (!socket.handshake.auth.type || !socket.handshake.auth.key) {
            logger.debug('Gateway connection failed: missing handshake data');
            return next(new Error('missing handshake data'));
        }

        const key: string = socket.handshake.auth.key;

        const decoded = ClientType.decode(socket.handshake.auth.type);
        if (isLeft(decoded)) {
            logger.debug('Gateway connection failed: unknown client type');
            return next(new Error('unknown client type'));
        }

        const type: ClientTypeT = decoded.right;

        socket.data.type = type;

        const keyConsumers: Record<ClientTypeT, (key: string) => Promise<void>> = {
            'user': async (key: string) => {
                const userId = await hc.ticketRepository.consume(key);
                socket.data.userId = userId;

                logger.verbose(`Authenticated [user/${socket.data.userId}] via ticket`);
            },
            'device': async (key: string) => {
                if (!socket.handshake.auth.deviceId) {
                    throw new Error('missing device id');
                }

                const deviceId = socket.handshake.auth.deviceId;
                const ownerId = await hc.deviceRepository.checkSecret(deviceId, key);

                const sockets = await namespace().in(`device_${deviceId}`).fetchSockets();
                if (sockets.length !== 0) {
                    throw new Error('device already connected');
                }

                socket.data.deviceId = deviceId;
                socket.data.ownerId = ownerId;

                logger.verbose(`Authenticated [device/${socket.data.deviceId}] via device secret`);
            }
        };

        try {
            await keyConsumers[type](key);
        } catch (err) {
            logger.debug(`Gateway authentication failed: ${err}`);
            return next(new Error(`client authentication failed: ${err}`));
        }

        next();
    }
);