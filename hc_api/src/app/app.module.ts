import { Module } from '@nestjs/common';
import { LoggerModule } from '../logging/logger.module.js';
import { APIModule } from './api/api.module.js';
import { AppController } from './app.controller.js';

@Module({
    imports: [APIModule, LoggerModule],
    controllers: [AppController],
})
export class AppModule { }
