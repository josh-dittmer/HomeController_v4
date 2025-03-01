import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../../../lib/common/responses.js';
import { verifyJothJwt } from '../../../lib/jwt.js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private readonly logger = new Logger('AuthManager');

    use(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return unauthorized(res);
        }

        const token = req.headers.authorization.substring(7);

        try {
            const data = verifyJothJwt(token);

            res.locals.userId = data.sub!; // checked in verify()
            res.locals.userEmail = data.email;

            this.logger.verbose(`Request is authorized for [${data.email}/${data.sub}]`);
        } catch {
            return unauthorized(res);
        }

        next();
    }
}
