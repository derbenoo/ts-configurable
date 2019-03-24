import { Controller, Get, Req } from '@nestjs/common';
import { LoggerService } from '../logging/logger.service';
import { ConfigService } from './config.service';

@Controller('/')
export class ConfigController {
  constructor(private readonly logger: LoggerService, private readonly config: ConfigService) {}

  @Get()
  getData(@Req() req): string {
    this.logger.log(`GET / 200 ${req.headers['user-agent']}`);
    return `
      <html>
        <body>
        <h3> Here's your final configuration object: </h3>

          <textarea readonly rows="30" cols="80">
${JSON.stringify(this.config, null, 2)}
          </textarea>
        </body>
      <html>
    `;
  }
}
