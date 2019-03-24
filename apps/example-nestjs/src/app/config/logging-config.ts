/** Logging configuration */
export class LoggingConfig {
  /** Whether to suppress all logging output */
  readonly silent = false;

  /** Logging level: 1=info, 2=warning, 3=error */
  readonly level = 1;

  /** Log level constants */
  readonly LEVEL = {
    INFO: 1,
    WARN: 2,
    ERR: 3,
  };
}
