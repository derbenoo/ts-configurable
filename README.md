# TS-Configurable

<p align="center">
<a href="https://www.npmjs.com/package/ts-configurable">
<img src="https://github.com/derbenoo/ts-configurable/raw/master/ts-configurable.svg?sanitize=true" alt="ts-configurable" width="250" />
</a>
</p>

<div align="center">
<p align="center">

[![npm](https://img.shields.io/npm/v/ts-configurable.svg?color=007acc)](https://www.npmjs.com/package/ts-configurable) [![GitHub](https://img.shields.io/github/license/derbenoo/ts-configurable.svg?color=007acc)](https://github.com/derbenoo/ts-configurable/blob/master/LICENSE) [![npm bundle size](https://img.shields.io/bundlephobia/min/ts-configurable.svg?color=007acc)](https://www.npmjs.com/package/ts-configurable)
[![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/ts-configurable.svg)](https://snyk.io/test/npm/ts-configurable) [![CircleCI (all branches)](https://img.shields.io/circleci/project/github/derbenoo/ts-configurable.svg)](https://circleci.com/gh/derbenoo/ts-configurable) [![Codecov](https://img.shields.io/codecov/c/gh/derbenoo/ts-configurable.svg)](https://codecov.io/gh/derbenoo/ts-configurable) [![Greenkeeper badge](https://badges.greenkeeper.io/derbenoo/ts-configurable.svg)](https://github.com/derbenoo/ts-configurable/blob/master/package.json)

:sparkles: **Make all properties of a class configurable using only one decorator!** :sparkles:

</p>
</div>

---

TODO: rewrite
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
TypeError: Property 'ServerConfig.port' is of type number but a value of type string ('"random"') was assigned!
```

## :tada: Benefits

- Type safety for your configuration:
  - No need to maintain a separate TypeScript interface
  - Types can be infered from the property's default value
  - Enforce correct types for values passed by environment variables and command line arguments (`strictTypeChecking` option)
- Take advantage of having a configuration class:
  - Calculate config values based on other config values (e.g. `url` from `host` and `port`)
  - Getter functions (e.g. `get debugPort() { return this.port + 1000; }`)
  - Inherit from other configuration classes
- Enforce configuration values to be read-only at compile time ([readonly modifier](https://www.typescriptlang.org/docs/handbook/classes.html#readonly-modifier)) and at runtime (`enforceReadonly` option)
- Load environment variables from a local file (using [dotenv](https://www.npmjs.com/package/dotenv/v/6.2.0))

## :wrench: API

### @Configurable([options])

**Configurable**(options?: `IDecoratorOptions`)

Class decorator for marking a class configurable: The values of all class properties can be set using the following sources, listed by priority (1 = highest):

1.  Command line arguments
2.  Environment variables
3.  Constructor options on instantiation
4.  Defaults provided with the property definitions

The final values for the config instance's properties are calculated upon instantiation.

##### options.enforceReadonly: _`boolean`_

Enforce that all properties are read-only by using `Object.freeze()` (default: true)

##### options.loadEnvFromFile: _`false`_ | [DotenvConfigOptions](https://www.npmjs.com/package/dotenv/v/6.2.0#options)

Apply environment variables from a file to the current `process.env`

##### options.parseArgv: _`false`_ | `IArgvOptions`

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

## :ok_hand: Provide Options and Defaults via the Constructor

By extending the `BaseConfig` class, both the options passed to the `@Configurable()` decorator as well as the default values assigned to the instance properties can be overriden via the constructor during instantiation:

```ts
// server-config.ts
import { Configurable, BaseConfig } from 'ts-configurable';

@Configurable({ parseEnv: { prefix: '' } })
class ServerConfig extends BaseConfig<ServerConfig> {
  host = 'localhost';
  port = 3000;
}

const config = new ServerConfig({
  options: {
    parseEnv: false,
  },
  config: {
    host: '0.0.0.0',
  },
});

console.log(config);
```

While activating the parsing of environment variables inside the decorator options, we override this setting again in the constructor provided options and set it to `false`, therefore disabling any environment variable parsing. Additionally, we override the default value for the `host` property from `localhost` to `0.0.0.0` inside the constructor as well:

```sh
# Ignore env variable "port", override host variable via constructor
$ port=4200 ts-node server-config.ts
ServerConfig { host: '0.0.0.0', port: 3000 }
```

## :open_mouth: Nested Properties

For nested configuration properties, it is recommended to define a new type for keeping type safety:

```ts
import { Configurable, BaseConfig } from 'ts-configurable';

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

Accessing nested properties is done using the `__` separator for environment variables (can be configured via `parseEnv.separator`) and the dot notation (`.`) for command line arguments:

```
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

## :grey_exclamation: Negating Boolean Arguments

If you want to explicitly set a field to `false` instead of just leaving it `undefined` or to override a default you can add a `no-` before the key: `--no-key`.

```
$ start pizza-app --cash --no-paypal
{ cash: true, paypal: false }
```

## :snowflake: Readonly Properties and Object Freezing

The ts-configurable package encourages developers to keep all configuration values static during the lifetime of the application. All sources (environment variables, command line arguments, ...) are parsed and merged during the instantiation of the configuration class object. After an object has been created, the object should be considered read-only, which can be enforced using the `enforceReadonly` option. This ensures that the configuration object is not modified at runtime (using [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)). Additionally, all class properties can be marked with the TypeScript `readonly` modifier to prevent assignments at compile time. This way, the developer gets instant feedback from his IDE if he accidentially tries to set a read-only configuration value.

Keeping all configuration values read-only after initialization has several benefits:

- The configuration object is a single source of truth, allowing all modules to have a consistent state
- The developer is assured that multiple reads of a configuration value return the same result
- The developer does not have to react to a configuration change (e.g., re-bind the webserver to a different port)

Only a restart of the application triggers a reloading of the configuration.

## :crown: Hierarchical + Partial Object Merging

The ability to specify configuration values using multiple sources (env vars, cmd args) necessitates the specification of a configuration source hierarchy. Each property assignment specified via one of the sources is always overriden by the same property assignment of a source higher in the loading hierarchy. The values specified via a source take precedence over all values specified in sources that are below in the loading hierarchy.

The configuration loading hierarchy is listed below (1 = highest, 4 = lowest):

1.  Command line arguments
2.  Environment variables
3.  Constructor options on instantiation
4.  Defaults provided with the property definitions

This behavior is implemented using the [nconf](https://www.npmjs.com/package/nconf) package. In short, each configuration source is converted into a partially filled configuration object. All those configuration objects are then merged with the precedence order listed above. This means that individual values can be set, even for nested properties!

## :pray: Contributing

You are welcome to contribute to the ts-configurable GitHub repository! All infos can be found here: [How to contribute](https://github.com/derbenoo/ts-configurable/blob/master/CONTRIBUTING.md)
