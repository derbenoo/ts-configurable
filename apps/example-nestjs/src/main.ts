import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from './app/config/config.service';
import { LoggerService } from './app/logging/logger.service';

async function bootstrap() {
  // Instantiate config service
  const config = new ConfigService({
    config: {
      web: {
        port: 3000,
        protocol: 'https',
      },
    },
  });

  const app = await NestFactory.create(AppModule.forRoot(config), {});

  // Set Nest logger to logging service
  const logger: LoggerService = app.get(LoggerService);
  app.useLogger(logger);

  // Start listening
  await app.listenAsync(config.web.port, config.web.host);
  logger.log(`Webserver listening at ${config.web.url}`);
}

bootstrap();
