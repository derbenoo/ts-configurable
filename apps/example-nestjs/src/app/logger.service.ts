import { Injectable } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(private readonly config: ConfigService) {}

  log(message: any, context?: string): any {
    if (this.config.logger.level <= 1) {
      this.print(`> ${message}`);
    }
  }

  warn(message: any, context?: string): any {
    if (this.config.logger.level <= 2) {
      this.print(`! ${message}`);
    }
  }

  error(message: any, trace?: string, context?: string): any {
    if (this.config.logger.level <= 3) {
      this.print(`X ${message}`);
    }
  }

  private print(message) {
    if (this.config.logger.silent) {
      return;
    }
    console.log(message);
  }
}
