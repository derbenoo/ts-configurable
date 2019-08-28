import { Injectable } from '@nestjs/common';
import { BaseConfig, Configurable } from '@ts-configurable';
import { DatabaseConfig } from '../database/database-config';
import { LoggingConfig } from '../logging/logging-config';
import { WebConfig } from './web-config';

@Injectable()
@Configurable()
/** Service providing configuration values */
export class ConfigService extends BaseConfig<ConfigService> {
  /** Webserver configuration */
  readonly web: Partial<WebConfig> = new WebConfig();

  /** Logging configuration */
  readonly log = new LoggingConfig();

  /** Database configuration */
  readonly db = new DatabaseConfig();
}
