import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HCModule } from '../hc/hc.module.js';
import { LoggerMiddleware } from '../log/logger.middleware.js';
import { LoggingModule } from '../log/logger.module.js';
import { AppController } from './app.controller.js';
import { DeviceController } from './controllers/device.controller.js';
import { TicketController } from './controllers/ticket.controller.js';
import { UserController } from './controllers/user.controller.js';
import { GatewayModule } from './gateway/gateway.module.js';
import { AuthMiddleware } from './middleware/auth.middleware.js';

@Module({
    imports: [
        LoggingModule,
        GatewayModule,
        HCModule
    ],
    controllers: [
        AppController,
        DeviceController,
        TicketController,
        UserController
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
        consumer.apply(AuthMiddleware).forRoutes(
            DeviceController, TicketController, UserController
        );
    }
}
