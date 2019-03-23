import * as http from 'http';
import { ServerConfig } from './config';

export class Server {
  static bootstrap() {
    const config = new ServerConfig({});
    const server = http.createServer();

    server.listen(config.port, config.host, () => {
      console.log(`> Server listening on ${config.url}`);
    });
  }
}
