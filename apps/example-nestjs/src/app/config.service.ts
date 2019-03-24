import { Configurable, BaseConfig } from '@ts-configurable';
import { Injectable } from '@nestjs/common';

/** Logging levels */
const LOG_LEVEL = {
  INFO: 1,
  WARN: 2,
  ERR: 3,
};

/** Logging configuration */
type TLoggingOptions = Partial<
  Readonly<{
    /** Whether to suppress all logging output */
    silent: boolean;

    /** Logging level: 1=info, 2=warning, 3=error */
    level: number;
  }>
>;

@Injectable()
@Configurable()
export class ConfigService extends BaseConfig<ConfigService> {
  /** Host to bind to*/
  readonly host: string = '0.0.0.0';

  /** Port to listen on */
  readonly port: number = 3000;

  /** Protocol used */
  readonly protocol: 'http' | 'https' = 'http';

  /** Logging configuration */
  readonly logger: TLoggingOptions = {
    silent: false,
    level: LOG_LEVEL.INFO,
  };

  /** Full URL the webserver is reachable at */
  get url() {
    return `${this.protocol}://${this.host}:${this.port}`;
  }
}
