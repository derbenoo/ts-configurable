import { Configurable, BaseConfig } from '@ts-configurable';
import { Injectable } from '@nestjs/common';
import { WebConfig } from './web-config';
import { LoggingConfig } from './logging-config';
import { DatabaseConfig } from './database-config';

@Injectable()
@Configurable()
/** Service providing configuration values */
export class ConfigService extends BaseConfig<ConfigService> {
  /** Webserver configuration */
  readonly web = new WebConfig();

  /** Logging configuration */
  readonly log = new LoggingConfig();

  /** Database configuration */
  readonly db = new DatabaseConfig();
}
