import { Module } from "@nestjs/common";
import { HCModule } from "../../hc/hc.module.js";
import { HCGateway } from "./gateway.js";

@Module({
    imports: [HCModule],
    providers: [HCGateway],
    exports: [HCGateway]
})
export class GatewayModule { }