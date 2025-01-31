import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { HCLogger } from "./logger.service.js";

@Module({
    providers: [
        HCLogger.register()
    ],
    exports: [
        HCLogger
    ]
})
export class LoggingModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        //consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}