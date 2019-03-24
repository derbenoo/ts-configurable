import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(private readonly config: ConfigService) {}

  log(message: any, context?: string): any {
    if (this.config.log.level <= this.config.log.LEVEL.INFO) {
      this.print(`> ${message}`);
    }
  }

  warn(message: any, context?: string): any {
    if (this.config.log.level <= this.config.log.LEVEL.WARN) {
      this.print(`! ${message}`);
    }
  }

  error(message: any, trace?: string, context?: string): any {
    if (this.config.log.level <= this.config.log.LEVEL.ERR) {
      this.print(`X ${message}`);
    }
  }

  private print(message) {
    if (this.config.log.silent) {
      return;
    }
    console.log(message);
  }
}
