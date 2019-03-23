import { Configurable } from '@ts-configurable';

@Configurable()
export class ServerConfig {
  /** Host */
  host = 'localhost';

  /** Port */
  port = 3000;

  /** Protocol */
  protocol: 'http' | 'https' = 'http';

  /** Complete URL */
  get url() {
    return `${this.protocol}://${this.host}:${this.port}`;
  }
}
