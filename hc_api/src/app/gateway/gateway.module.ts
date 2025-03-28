import { Module } from '@nestjs/common';
import { RepoModule } from '../repo/repo.module.js';
import { DeviceGateway } from './device/device.gateway.js';
import { HCGateway } from './gateway.js';

@Module({
    imports: [RepoModule],
    providers: [DeviceGateway, HCGateway],
    exports: [HCGateway],
})
export class GatewayModule { }
