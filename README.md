# TS-Configurable

<p align="center">
<a href="https://www.npmjs.com/package/ts-configurable">
<img src="https://github.com/derbenoo/ts-configurable/raw/master/ts-configurable.svg?sanitize=true" alt="ts-configurable" width="250" />
</a>
</p>

<div align="center">
<p align="center">

[![npm](https://img.shields.io/npm/v/ts-configurable.svg?color=007acc)](https://www.npmjs.com/package/ts-configurable) [![GitHub](https://img.shields.io/github/license/derbenoo/ts-configurable.svg?color=007acc)](https://github.com/derbenoo/ts-configurable/blob/master/LICENSE) [![npm bundle size](https://img.shields.io/bundlephobia/min/ts-configurable.svg?color=007acc)](https://www.npmjs.com/package/ts-configurable)
[![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/ts-configurable.svg)](https://snyk.io/test/npm/ts-configurable) [![CircleCI (all branches)](https://img.shields.io/circleci/project/github/derbenoo/ts-configurable.svg)](https://circleci.com/gh/derbenoo/ts-configurable) [![Codecov](https://img.shields.io/codecov/c/gh/derbenoo/ts-configurable.svg)](https://codecov.io/gh/derbenoo/ts-configurable)

:sparkles: **Make all properties of a class configurable using only one decorator!** :sparkles:

</p>
</div>

---

Let's be real, configuration is not sexy. We all just want to set up our project's configuration as easily as possible and then move on to build whatever we _actually_ wanted to build. But what if I told you that you can meet all your configuration needs with a single line of code and then never have to worry about it again?

Simply create a class defining all configuration properties, tack on the `@Configurable()` decorator and off you go! Take advantage of type-safety, environment variable loading, command line argument parsing and much more right out-of-the-box.

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

Due to the `@Configurable()` decorator, the values for all properties can now be set via environment variables or command line arguments:

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

##### options.strictObjectStructureChecking: _`boolean`_

Throw an error if a config entry is set to a value of a different structure than the default value (e.g., assigning an object to a primitive property) (default: true)

##### options.decryption: _`false`_ | `IDecryptionOptions`
Whether to attempt decryption of encrypted configuration values (default: false)


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
// order-pizza.ts
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
$ ts-node order-pizza.ts --order.recipient=Jonny"

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

## :book: Loading Environment Variables from a File

It can be useful during development to keep a local `.env` file containing configuration values that the developer wants to set for himself. The file is typically excluded from version control (e.g., by adding it to the `.gitignore` of the repository). When using the `@Configurable()` decorator, environment variables specified in a `.env` file located in the current working directory are loaded into `process.env` before the configuration object is created. However, another path can be specified using the `loadEnvFromFile.path` option.

This functionality is implemented using the [dotenv](https://www.npmjs.com/package/dotenv/v/6.2.0) package. You can find out more by reading the package's documentation:

- [Options](https://www.npmjs.com/package/dotenv/v/6.2.0#options)
- [Rules](https://www.npmjs.com/package/dotenv/v/6.2.0#rules)
- [FAQ](https://www.npmjs.com/package/dotenv/v/6.2.0#faq)

## :grey_exclamation: Negating Boolean Arguments

If you want to explicitly set a field to `false` instead of just leaving it `undefined` or to override a default you can add a `no-` before the key: `--no-key`.

```ts
// pay-pizza.ts
import { Configurable } from 'ts-configurable';

@Configurable()
class PizzaConfig {
  cash = false;
  debit = true;
  paypal = true;
}

console.log(new PizzaConfig());
```

```
$ ts-node pay-pizza.ts --cash --no-paypal
{ cash: true, debit: true, paypal: false }
```

## :snowflake: Readonly Properties and Object Freezing

The ts-configurable package encourages developers to keep all configuration values static throughout the lifetime of the application. All sources (environment variables, command line arguments, ...) are parsed and merged during the instantiation of the configuration class object. After an object has been created, the object should be considered read-only, which can be enforced using the `enforceReadonly` option. This ensures that the configuration object is not modified at runtime (using [Object.freeze](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)). Additionally, all class properties can be marked with the TypeScript `readonly` modifier to prevent assignments at compile time. This way, the developer gets instant feedback from his IDE if he accidentially tries to set a read-only configuration value.

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

## :lock: Encrypted Configuration Values

It is possible to provide encrypted configuration values. This is useful for secrets that should not be checked into source control but should be available as soon as the application is in possession of a single (or multiple) decryption secrets instead of having to provide each secret configuration value via environment variables. The decryption secrets are provided via the `decryption` option. The following decryption secret types can be specified:
* `raw`: the secret is directly provided as a string
* `env`: the secret is read from the environment variable with the specified name (via: `environmentVariable`)
* `file`: the secret is read from the file with the specified filepath (via: `filepath`)

If multiple decryption secrets are provided, ts-configurable will attempt to decrypt each encrypted configuration value with all of the available keys. If a key could not be loaded, it is ignored. If an encrypted configuration value could not be successfully decrypted, it is left in its original, encrypted form.

You can encrypt configuration values via the `encrypt(secret: string, plaintext: string)` method that is being exported by the `ts-configurable` package. The typical workflow would be to encrypt the secret configuration value e.g., via a separate node invocation and then using the resulting ciphertext for configuring the application. Here is a simple `ts-node` example on how to encrypt a secret configuration value:

```ts
import { encrypt } from 'ts-configurable';

const secret = 'secret_key';
const value = 'sensitive_api_key';
const cipher = encrypt(secret, value);
console.log(`CIPHER: ${cipher}`);
// output: CIPHER: $ENC$.6aaa302f81c67ce6fe2da026ba7a2d0b.91b5db5ffea63e0d2c89c350760ca54152e6d4b5526ef06f8d6952407120891c
```

## :rotating_light: Troubleshooting

#### TypeError: Class constructor BaseConfig cannot be invoked without 'new'

This error occurs when a custom class extends the `BaseConfig` class and the TypeScript compiler target is below ES6. The root cause for this issue is that the ts-configurable package is compiled with the ES6 target and an ES5 class cannot extend an ES6 class (classes are compiled to functions in ES5 while ES6 natively supports classes). Therefore, this error can be fixed by setting the compiler target to ES6 or higher:

```json
// tsconfig.json
...
"compilerOptions": {
  "target": "es6"
```

## :books: Examples

Here are some example applications showcasing how to use the ts-configurable package:

- [Minimal webserver](https://github.com/derbenoo/ts-configurable/tree/master/apps/example-webserver)
- [NestJS webserver](https://github.com/derbenoo/ts-configurable/tree/master/apps/example-nestjs)

## :pray: Contributing

You are welcome to contribute to the ts-configurable GitHub repository! All infos can be found here: [How to contribute](https://github.com/derbenoo/ts-configurable/blob/master/CONTRIBUTING.md)
