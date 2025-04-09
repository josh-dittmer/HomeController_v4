import { Logger } from "@nestjs/common";
import { isLeft } from 'fp-ts/lib/Either.js';
import { HCGatewayModels } from "hc_models/models";
import { HCGatewayTypes } from "hc_models/types";
import { UUID } from "io-ts-types";
import { ExtendedError } from "socket.io";
import { tryCatch } from "../../../../lib/try-catch.js";
import { RepoService } from "../../../repo/services/repo.service.js";

export const userMiddleware = (server: HCGatewayTypes.User.Server, hc: RepoService, logger: Logger) =>
    async (socket: HCGatewayTypes.User.ServerSocket, next: (err?: ExtendedError) => void) => {
        const decoded = HCGatewayModels.User.Auth.decode(socket.handshake.auth);
        if (isLeft(decoded)) {
            logger.debug('Gateway connection failed: invalid auth data');
            return next(new Error('invalid auth data'));
        }

        const auth: HCGatewayModels.User.AuthT = decoded.right;

        const { data: userId, error } = await tryCatch(hc.ticketRepository.consume(auth.ticket));
        if (error) {
            logger.debug(`Gateway connection failed: ${error.message}`);
            return next(error);
        }

        const socketData: HCGatewayModels.User.SocketDataT = {
            id: userId,
            queues: new Map<UUID, Array<(state: unknown) => void>>()
        };

        socket.data.user = socketData;

        logger.verbose(`Authenticated [user/${socketData.id}] via ticket`);

        next();
    };