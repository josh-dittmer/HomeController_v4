import { Controller, Delete, Get, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/lib/Either.js';
import {
    CreateDeviceRequest,
    CreateDeviceRequestT,
    CreateDeviceResponseT,
    EditDeviceRequest,
    EditDeviceRequestT,
    GetAllDevicesResponseT,
    GetOneDeviceResponseT,
} from 'hc_models/models';
import { cast } from 'hc_models/util';
import { MaxDeviceDescriptionLength, MaxDeviceNameLength } from 'hc_models/values';
import { UUID } from 'io-ts-types';
import { badRequest, notFound } from '../../../lib/common/responses.js';
import { DeviceService } from '../../gateway/device/services/device.service.js';
import { RepoService } from '../../repo/services/repo.service.js';

@Controller('device')
export class DeviceController {
    private readonly logger = new Logger('DeviceController');

    constructor(
        private readonly hc: RepoService,
        private readonly deviceService: DeviceService,
    ) { }

    @Get('all')
    async getAll(@Req() req: Request, @Res() res: Response) {
        const devices = await this.hc.deviceRepository.getAll(res.locals.userId);

        const result: GetAllDevicesResponseT = {
            onlineDevices: [],
            offlineDevices: [],
        };

        const onlineDeviceIds = await this.deviceService.getOnlineDevices(res.locals.userId);

        devices.forEach(device => {
            if (onlineDeviceIds.has(device.deviceId)) {
                result.onlineDevices.push(device);
            } else {
                result.offlineDevices.push(device);
            }
        });

        res.json(result);
    }

    @Get(':id')
    async getOne(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const device = await this.hc.deviceRepository.getOne(res.locals.userId, id);

        if (!device) {
            return res.json(notFound(res, `device ${id}`));
        }

        const result: GetOneDeviceResponseT = {
            device: device,
            online: await this.deviceService.isDeviceOnline(cast(UUID)(res.locals.userId), device.deviceId),
        };

        res.json(result);
    }

    @Post('create')
    async create(@Req() req: Request, @Res() res: Response) {
        const decoded = CreateDeviceRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: CreateDeviceRequestT = decoded.right;

        if (
            data.name.length > MaxDeviceNameLength ||
            data.description.length > MaxDeviceDescriptionLength
        ) {
            return badRequest(res);
        }

        const { id, secret } = await this.hc.deviceRepository.create(res.locals.userId, data);

        const result: CreateDeviceResponseT = {
            deviceId: id,
            secret: secret,
        };

        this.logger.log(`[device/${id}] created`);

        res.json(result);
    }

    @Post(':id/edit')
    async edit(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const decoded = EditDeviceRequest.decode(req.body);
        if (isLeft(decoded)) {
            console.log(req.body);
            return badRequest(res);
        }

        const data: EditDeviceRequestT = decoded.right;

        if (
            data.name.length > MaxDeviceNameLength ||
            data.description.length > MaxDeviceDescriptionLength
        ) {
            return badRequest(res);
        }

        const numUpdated = await this.hc.deviceRepository.edit(res.locals.userId, id, data);

        if (numUpdated === 0) {
            return notFound(res, `device ${id}`);
        }

        this.logger.verbose(`[device/${id}] updated`);

        res.json({});
    }

    @Delete(':id/delete')
    async delete(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const numUpdated = await this.hc.deviceRepository.delete(res.locals.userId, id);

        if (numUpdated === 0) {
            return notFound(res, `device ${id}`);
        }

        this.deviceService.sendDeviceDeletedNotification(cast(UUID)(res.locals.userId), cast(UUID)(id), {});

        this.logger.log(`[device/${id}] deleted`);

        res.json({});
    }
}
