import { Logger } from "@nestjs/common";
import { ExtendedError, Socket } from "socket.io";
import { RepoService } from "../../repo/services/repo.service.js";

export const deviceMiddleware = (hc: RepoService, logger: Logger) =>
    async (socket: Socket, next: (err?: ExtendedError) => void) => {
        next();
    };