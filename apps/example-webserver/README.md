# Minimal webserver example

> The source-code for this example can be found here: `apps/example-webserver/src/`

The minimal webserver example is a plain HTTP server using the ts-configurable package for its configuration class. The application does nothing else than serving the returning configuration object upon an HTTP request to showcase a minimal setup using the ts-configurable package.

## Get Started

The instructions on how to spin up a development environment can be found here: [Development Setup](../../CONTRIBUTING.md).

```sh
$ npm run start example-webserver
> Server listening on http://0.0.0.0:3000
> Configuration object:
{
  "host": "0.0.0.0",
  "port": 3000,
  "protocol": "http"
}
```

Head over to: http://localhost:3000/ to see the final configuration object. You can now experiment with environment variables, command line arguments etc and observe how the configuration object is being modified.

## Configuration Class

```ts
import { Configurable, BaseConfig } from '@ts-configurable';

@Configurable()
export class ServerConfig extends BaseConfig<ServerConfig> {
  /** Host */
  host = '0.0.0.0';

  /** Port */
  port = 3000;

  /** Protocol */
  protocol: 'http' | 'https' = 'http';

  /** Complete URL */
  get url() {
    return `${this.protocol}://${this.host}:${this.port}`;
  }
}
```
