import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';
import {
  GLOBAL_PREFIX,
  CORS_ORIGIN,
  APP_PORT_CONFIG_KEY,
  APP_DEFAULT_PORT,
} from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.enableCors({ origin: CORS_ORIGIN });

  const configService = app.get(ConfigService);
  const port = configService.get<number>(APP_PORT_CONFIG_KEY) || APP_DEFAULT_PORT;

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();
