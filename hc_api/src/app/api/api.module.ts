import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from '../../logging/middleware/logger.middleware.js';
import { AppController } from '../app.controller.js';
import { GatewayModule } from '../gateway/gateway.module.js';
import { RepoModule } from '../repo/repo.module.js';
import { DeviceController } from './controllers/device.controller.js';
import { TicketController } from './controllers/ticket.controller.js';
import { UserController } from './controllers/user.controller.js';
import { AuthMiddleware } from './middleware/auth.middleware.js';
@Module({
    imports: [RepoModule, GatewayModule],
    controllers: [AppController, DeviceController, TicketController, UserController],
})
export class APIModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*path');
        consumer
            .apply(AuthMiddleware)
            .forRoutes(DeviceController, TicketController, UserController);
    }
}
