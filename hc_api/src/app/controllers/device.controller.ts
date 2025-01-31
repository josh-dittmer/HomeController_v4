import { Controller, Delete, Get, Logger, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from 'express';
import { isLeft } from 'fp-ts/lib/Either.js';
import { CreateDeviceRequest, CreateDeviceRequestT, CreateDeviceResponseT, EditDeviceRequest, EditDeviceRequestT, GetAllDevicesResponseT, GetOneDeviceResponseT } from "hc_models/models";
import { MaxDeviceDescriptionLength, MaxDeviceNameLength } from "hc_models/values";
import { badRequest, notFound } from "../../common/responses.js";
import { HCService } from "../../hc/hc.service.js";
import { HCGateway } from "../gateway/gateway.js";

@Controller('device')
export class DeviceController {
    private readonly logger = new Logger('DeviceController');

    constructor(private readonly hc: HCService, private readonly gateway: HCGateway) { }

    @Get('all')
    async getAll(@Req() req: Request, @Res() res: Response) {
        const devices = await this.hc.deviceRepository.getAll(res.locals.userId);

        const result: GetAllDevicesResponseT = {
            onlineDevices: [],
            offlineDevices: []
        }

        const onlineDeviceIds = await this.gateway.getOnlineDevices(res.locals.userId);

        devices.forEach((device) => {
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
            online: await this.gateway.isDeviceOnline(res.locals.userId, device.deviceId)
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

        if (data.name.length > MaxDeviceNameLength || data.description.length > MaxDeviceDescriptionLength) {
            return badRequest(res);
        }

        const { id, secret } = await this.hc.deviceRepository.create(res.locals.userId, data);

        const result: CreateDeviceResponseT = {
            deviceId: id,
            secret: secret
        }

        this.logger.log(`[device/${id}] created`);

        res.json(result);
    }

    @Post(':id/edit')
    async edit(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const decoded = EditDeviceRequest.decode(req.body);
        if (isLeft(decoded)) {
            return badRequest(res);
        }

        const data: EditDeviceRequestT = decoded.right;

        if (data.name.length > MaxDeviceNameLength || data.description.length > MaxDeviceDescriptionLength) {
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

        this.gateway.sendDeleteEvent(res.locals.userId, id);

        this.logger.log(`[device/${id}] deleted`);

        res.json({});
    }
}