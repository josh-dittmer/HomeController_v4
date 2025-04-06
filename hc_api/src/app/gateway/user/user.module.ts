import { forwardRef, Module } from "@nestjs/common";
import { RepoModule } from "../../repo/repo.module.js";
import { DeviceModule } from "../device/device.module.js";
import { UserGateway } from "./gateways/user.gateway.js";
import { UserService } from "./services/user.service.js";

@Module({
    imports: [
        RepoModule,
        forwardRef(() => DeviceModule)
    ],
    providers: [
        UserGateway,
        UserService.register()
    ],
    exports: [UserService]
})
export class UserModule { }