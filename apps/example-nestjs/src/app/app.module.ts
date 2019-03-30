import { DynamicModule, Module } from '@nestjs/common';
import { ConfigController } from './config/config.controller';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { LoggerService } from './logging/logger.service';

@Module({
  controllers: [ConfigController],
  providers: [LoggerService],
})
export class AppModule {
  static forRoot(config: ConfigService): DynamicModule {
    return {
      imports: [DatabaseModule.forRoot(config)],
      module: AppModule,
      providers: [
        {
          provide: ConfigService,
          useValue: config,
        },
      ],
    };
  }
}
