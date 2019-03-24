import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerService } from './logger.service';
import { ConfigService } from './config/config.service';

@Module({
  controllers: [AppController],
  providers: [LoggerService, ConfigService],
})
export class AppModule {}
