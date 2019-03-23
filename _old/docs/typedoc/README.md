
![dotenv](docs/ts-configurable.png) # TS-Configurable

:sparkles: **Make all properties of a class configurable using only one decorator!** :sparkles:

TS-Configurable implements the `@Configurable()` decorator to make any class configurable via environment variables and command line arguments! Additionally, the `BaseConfig<T>` class can be extended to allow the passing of an options (`options: Partial<T>`) object that can partially override the property defaults specified in the configuration class:

:running: Get started
---------------------

Install via `npm i ts-configurable` and create a config class with default values for each property:

```ts
// server-config.ts
import { Configurable } from 'ts-configurable';

@Configurable()
class ServerConfig {
  host = 'localhost';
  port = 3000;
}

console.log(new ServerConfig());
```

Due to the `@Configurable()` decorator, the values for all properties can now be set via environment variables and command line arguments:

```sh
# Default config instance
$ ts-node server-config.ts
ServerConfig { host: 'localhost', port: 3000 }

# Change port via command line argument
$ ts-node server-config.ts --port=4200
ServerConfig { host: 'localhost', port: 4200 }

# Change host via environment variable
$ host=0.0.0.0 ts-node server-config.ts
ServerConfig { host: '0.0.0.0', port: 3000 }
```

:tada: Features
---------------

*   Type safety for your configuration:
    *   No need to maintain a separate interface
    *   Types can be infered from the property default value
    *   Enforce correct types for values passed by environment variables and command line arguments
*   Take full advantage of having a configuration class:
    *   Calculate config values based on other config values (e.g. `url` from `host` and `port`)
    *   Getter functions (e.g. `get debugPort() { return this.port + 1000; }`)
    *   Inherit from other (config) classes
*   Enforce the configuration object to be read-only
*   Load environment variables from a local file (using [dotenv](https://www.npmjs.com/package/dotenv))

:wrench: API
------------

### @Configurable(\[options\])

Hierarchical atomic object merging
----------------------------------

Provide options and config values via constructor
-------------------------------------------------

Example: Nested Properties
--------------------------

```ts
import { Configurable, BaseConfig } from '@tfs/config';

type TOrder = Partial<{
  recipient: string;
  priceTotal: number;
  delivered: boolean;
  billing: Partial<{ address: string }>;
}>;

class BasePizzaConfig extends BaseConfig<BasePizzaConfig> {
  id = 5;
  topping = 'cheese';
  rating = null;
  ingredients = ['tomato', 'bread'];
  order: TOrder = {
    recipient: 'John Doe',
    priceTotal: 6.2,
    delivered: true,
    billing: {
      address: 'Jerkstreet 53a, 1234 Whatevertown',
    },
  };
}

const pizzaConfig = new PizzaConfig({ topping: 'bacon' });
console.log(JSON.stringify(pizzaConfig, null, 2));
```

By adding the `@Configurable()` decorator to any class, all of its properties can be configured via environment variables and command line arguments:

```sh
export pizza_order__delivered=false
$ start pizza-app --order.recipient=Jonny"

{
  "id": 5,
  "topping": "bacon",
  "rating": null,
  "ingredients": [
    "tomato",
    "bread"
  ],
  "order": {
    "recipient": "Jonny",
    "priceTotal": 6.2,
    "delivered": false,
    "billing": {
      "address": "Jerkstreet 53a, 1234 Whatevertown"
    }
  }
}
```

Negating Boolean Arguments
--------------------------

If you want to explicitly set a field to `false` instead of just leaving it `undefined` or to override a default you can add a `no-` before the key: `--no-key`.

```
$ start pizza-app --cash --no-paypal
{ cash: true, paypal: false }
```

Test Coverage
-------------

## Index

### External modules

* ["base-config"](modules/_base_config_.md)
* ["configurable"](modules/_configurable_.md)
* ["interfaces"](modules/_interfaces_.md)
* ["util"](modules/_util_.md)

---

