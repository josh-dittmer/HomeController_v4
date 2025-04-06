import { Logger } from "@nestjs/common";
import { isLeft } from 'fp-ts/lib/Either.js';
import { HCGatewayModels } from "hc_models/models";
import { HCGatewayTypes } from "hc_models/types";
import { ExtendedError } from "socket.io";
import { tryCatch } from "../../../../lib/try-catch.js";
import { RepoService } from "../../../repo/services/repo.service.js";

export const deviceMiddleware = (server: HCGatewayTypes.Device.Server, hc: RepoService, logger: Logger) =>
    async (socket: HCGatewayTypes.Device.ServerSocket, next: (err?: ExtendedError) => void) => {
        const decoded = HCGatewayModels.Device.Auth.decode(socket.handshake.auth);
        if (isLeft(decoded)) {
            logger.debug('Gateway connection failed: invalid auth data');
            return next(new Error('invalid auth data'));
        }

        const auth: HCGatewayModels.Device.AuthT = decoded.right;

        const { data: ownerId, error } = await tryCatch(hc.deviceRepository.checkSecret(auth.id, auth.secret));
        if (error) {
            logger.debug(`Gateway connection failed: ${error.message}`);
            return next(error);
        }

        const sockets = await server.in(`device_${auth.id}`).fetchSockets();
        if (sockets.length !== 0) {
            logger.debug('Gateway connection failed: device already connected');
            return next(new Error('device already connected'));
        }

        const socketData: HCGatewayModels.Device.SocketDataT = {
            id: auth.id,
            owner: ownerId
        };

        socket.data.device = socketData;

        logger.verbose(`Authenticated [device/${socketData.id}] via device secret`);

        next();
    };