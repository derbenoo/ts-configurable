import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from './app/config/config.service';
import { LoggerService } from './app/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  const config: ConfigService = app.get(ConfigService);
  const logger: LoggerService = app.get(LoggerService);
  app.useLogger(logger);

  await app.listenAsync(config.web.port, config.web.host);
  logger.log(`Webserver listening at ${config.web.url}`);
}

bootstrap();
