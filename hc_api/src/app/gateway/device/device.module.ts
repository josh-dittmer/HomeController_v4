import { forwardRef, Module } from "@nestjs/common";
import { RepoModule } from "../../repo/repo.module.js";
import { UserModule } from "../user/user.module.js";
import { DeviceGateway } from "./gateways/device.gateway.js";
import { DeviceService } from "./services/device.service.js";

@Module({
    imports: [
        RepoModule,
        forwardRef(() => UserModule)
    ],
    providers: [
        DeviceGateway,
        DeviceService.register()
    ],
    exports: [
        DeviceGateway,
        DeviceService
    ]
})
export class DeviceModule { }