import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';

@Module({})
export class DatabaseModule {
  static forRoot(config: ConfigService): DynamicModule {
    return {
      imports: [TypeOrmModule.forRoot(config.db)],
      module: DatabaseModule,
    };
  }
}
