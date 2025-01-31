import { NestFactory } from '@nestjs/core';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import { AppModule } from './app/app.module.js';
import { API_PORT, API_PREFIX, CORS_ALLOWED_ORIGIN } from './common/values.js';
import { HCLogger } from './log/logger.service.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true
    })

    app.useLogger(app.get(HCLogger));

    const corsOptions: CorsOptions = {
        origin: CORS_ALLOWED_ORIGIN
    }

    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(cookieParser());


    app.setGlobalPrefix(API_PREFIX);

    await app.listen(API_PORT);
}

bootstrap();
