import { Configurable } from '@ts-configurable';

@Configurable()
export class ServerConfig {
  /** Host to bind the webserver to */
  host = '0.0.0.0';

  /** Port to listen on */
  port = 3000;

  /** Protocol (http or https) */
  protocol: 'http' | 'https' = 'http';

  /** Complete URL of the webserver */
  get url() {
    return `${this.protocol}://${this.host}:${this.port}`;
  }
}
