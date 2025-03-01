import { Module } from '@nestjs/common';
import { RepoModule } from '../repo/repo.module.js';
import { HCGateway } from './gateway.js';

@Module({
    imports: [RepoModule],
    providers: [HCGateway],
    exports: [HCGateway],
})
export class GatewayModule { }
