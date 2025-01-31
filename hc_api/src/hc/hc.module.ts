import { Module } from "@nestjs/common";
import { HCService } from "./hc.service.js";

@Module({
    providers: [
        HCService.register()
    ],
    exports: [
        HCService
    ],
})
export class HCModule { }