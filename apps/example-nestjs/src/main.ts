import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from './app/config.service';
import { LoggerService } from './app/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const config: ConfigService = app.get(ConfigService);
  const logger: LoggerService = app.get(LoggerService);
  app.useLogger(logger);

  await app.listenAsync(config.port, config.host);
  logger.log(`Webserver listening at ${config.url}`);
}

bootstrap();
