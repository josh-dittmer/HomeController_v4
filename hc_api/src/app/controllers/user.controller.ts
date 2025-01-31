import { Controller, Get, Logger, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { isLeft } from 'fp-ts/lib/Either.js';
import { CreateUserRequest, CreateUserRequestT, EditUserRequest, GetMyProfileResponseT } from "hc_models/models";
import { MaxUserNameLength } from "hc_models/values";
import { badRequest, notFound } from "../../common/responses.js";
import { HCService } from "../../hc/hc.service.js";

@Controller('user')
export class UserController {
    private readonly logger = new Logger('UserController')

    constructor(private readonly hc: HCService) { }

    @Get('me')
    async getMyProfile(@Req() req: Request, @Res() res: Response) {
        const user = await this.hc.userRepository.getOne(res.locals.userId);

        const result: GetMyProfileResponseT = {
            user: user,
            email: res.locals.userEmail
        };

        res.json(result);
    }

    @Post('create')
    async create(@Req() req: Request, @Res() res: Response) {
        const decoded = CreateUserRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateUserRequestT = decoded.right;

        if (data.name.length > MaxUserNameLength) {
            return badRequest(res);
        }

        await this.hc.userRepository.create(res.locals.userId, data);

        this.logger.log(`[user/${res.locals.userId}] created`);

        res.json({});
    }

    @Post('edit')
    async edit(@Req() req: Request, @Res() res: Response) {
        const decoded = EditUserRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateUserRequestT = decoded.right;

        if (data.name.length > MaxUserNameLength) {
            return badRequest(res);
        }

        const numUpdated = await this.hc.userRepository.edit(res.locals.userId, data);

        if (numUpdated === 0) {
            return notFound(res, `user ${res.locals.userId}`);
        }

        this.logger.verbose(`[user/${res.locals.userId}] updated`);

        res.json({});
    }
}