import { Module } from '@nestjs/common';
import { HCLogger } from './services/logger.service.js';

@Module({
    providers: [HCLogger.register()],
    exports: [HCLogger],
})
export class LoggerModule { }
