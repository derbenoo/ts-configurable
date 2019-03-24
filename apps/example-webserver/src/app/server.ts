import * as http from 'http';
import { ServerConfig } from './config';

export class Server {
  static bootstrap() {
    const config = new ServerConfig({});

    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write(JSON.stringify(config, null, 2));
      res.end();
    });

    server.listen(config.port, config.host, () => {
      console.log(`> Server listening on ${config.url}`);
      console.log(`> Configuration object:\n${JSON.stringify(config, null, 2)}`);
    });
  }
}
