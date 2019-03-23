import { Configurable } from '../src';

@Configurable()
class ServerConfig {
  host = 'localhost';
  port = 3000;
  get debugPort() {
    return this.port + 1000;
  }
}

const config = new ServerConfig();
console.log(config);
