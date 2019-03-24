import { Controller, Get, Req } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Controller('/')
export class AppController {
  constructor(private readonly logger: LoggerService) {}

  @Get()
  getData(@Req() req): string {
    this.logger.log(`GET / 200 ${req.headers['user-agent']}`);
    return 'Hello World!';
  }
}
