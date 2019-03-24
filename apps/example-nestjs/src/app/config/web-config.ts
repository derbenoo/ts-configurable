/** Webserver configuration */
export class WebConfig {
  /** Host to bind to*/
  readonly host: string = '0.0.0.0';

  /** Port to listen on */
  readonly port: number = 3000;

  /** Protocol used */
  readonly protocol: 'http' | 'https' = 'http';

  /** Full URL the webserver is reachable at */
  readonly url = `${this.protocol}://${this.host}:${this.port}`;
}
