# TS-Configurable

<p align="center">
<img src="https://github.com/derbenoo/ts-configurable/raw/master/ts-configurable.svg?sanitize=true" alt="ts-configurable" width="250" />
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/ts-configurable.svg?color=007acc)](https://www.npmjs.com/package/ts-configurable) [![GitHub](https://img.shields.io/github/license/derbenoo/ts-configurable.svg?color=007acc)](https://github.com/derbenoo/ts-configurable/blob/master/LICENSE) [![npm bundle size](https://img.shields.io/bundlephobia/min/ts-configurable.svg?color=007acc)](https://www.npmjs.com/package/ts-configurable)

[![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/ts-configurable.svg)](https://snyk.io/test/npm/ts-configurable) [![CircleCI (all branches)](https://img.shields.io/circleci/project/github/derbenoo/ts-configurable.svg)](https://circleci.com/gh/derbenoo/ts-configurable) [![Codecov](https://img.shields.io/codecov/c/gh/derbenoo/ts-configurable.svg)](https://codecov.io/gh/derbenoo/ts-configurable) [![Greenkeeper badge](https://badges.greenkeeper.io/derbenoo/ts-configurable.svg)](https://github.com/derbenoo/ts-configurable/blob/master/package.json)

:sparkles: **Make all properties of a class configurable using only one decorator!** :sparkles:

</div>

---

TS-Configurable implements the `@Configurable()` decorator to make any class configurable via environment variables and command line arguments! Additionally, the `BaseConfig<T>` class can be extended to allow the passing of an options (`options: Partial<T>`) object that can partially override the property defaults specified in the configuration class:

## :running: Get started

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

# Throw an error if a value with a different type was assigned
$ port=random ts-node server-config.ts
Property 'ServerConfig.port' is of type number but a value of type string ('"random"') was assigned!
```

## :tada: Features

- Type safety for your configuration:
  - No need to maintain a separate interface
  - Types can be infered from the property's default value
  - Enforce correct types for values passed by environment variables and command line arguments
- Take full advantage of having a configuration class:
  - Calculate config values based on other config values (e.g. `url` from `host` and `port`)
  - Getter functions (e.g. `get debugPort() { return this.port + 1000; }`)
  - Inherit from other (config) classes
- Enforce the configuration object to be read-only
- Load environment variables from a local file (using [dotenv](https://www.npmjs.com/package/dotenv))

## :wrench: API

### @Configurable([options])

**Configurable**(options?: `IDecoratorOptions`)

Class decorator for marking a class configurable: The values of all class properties can be set using the following sources, listed by priority (1 = highest):

1.  Command line arguments
2.  Environment variables
3.  Constructor options on instantiation
4.  Defaults provided with the property definitions

The final values for the config instance's properties are calculated upon instantiation.

##### options.enforceReadonly: `boolean`

Enforce that all properties are read-only by using `Object.freeze()` (default: true)

##### options.loadEnvFromFile: `false` | [DotenvConfigOptions](https://www.npmjs.com/package/dotenv#options)

Apply environment variables from a file to the current `process.env`

##### options.parseArgv: `false` | `IArgvOptions`

Whether to parse command line arguments (default: true)

##### options.parseArgv.prefix: _`string`_

Prefix for command line arguments (default: no prefix)

##### options.parseEnv: `false` | `IEnvOptions`

Whether to parse environment variables (default: true)

##### options.parseEnv.lowerCase: _`boolean`_

Whether to lower-case environment variables (default: false)

##### options.parseEnv.prefix: _`string`_

Prefix for environment variables (default: no prefix)

##### options.parseEnv.separator: _`string`_

Seperator for environment variables (default: '\_\_')

##### options.parseValues: _`boolean`_

Attempt to parse well-known values (e.g. 'false', 'null', 'undefined' and JSON values) into their proper types (default: true)

##### options.strictTypeChecking: _`boolean`_

Throw an error if a config entry is set to a value of a different type than the default value (e.g. assigning a number to a string property) (default: true)

## Example: Nested Properties

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

## Provide options and config values via constructor

## Negating Boolean Arguments

If you want to explicitly set a field to `false` instead of just leaving it `undefined` or to override a default you can add a `no-` before the key: `--no-key`.

```
$ start pizza-app --cash --no-paypal
{ cash: true, paypal: false }
```

## Hierarchical atomic object merging

## Contributing

You are welcome to contribute to the ts-configurable GitHub repository! All infos can be found here: [How to contribute](https://github.com/derbenoo/ts-configurable/blob/master/CONTRIBUTING.md)
