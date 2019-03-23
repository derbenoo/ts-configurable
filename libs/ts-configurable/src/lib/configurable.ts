import * as dotenv from 'dotenv'; // https://www.npmjs.com/package/dotenv
import * as isPlainObject from 'is-plain-object'; // https://www.npmjs.com/package/is-plain-object
import { Provider } from 'nconf'; // https://www.npmjs.com/package/nconf
import { IDecoratorOptions, IConstructorOptions } from './interfaces';
import { assignValuesByTemplate } from './util';
import { BaseConfig } from './base-config';

/**
 * Get the final options object containing all options for the @Configurable() decorator.
 * The options are generated using three sources, listed by priority (1 = highest):
 *  1. Options set via the config class constructor.
 *  2. Options set via the @Configurable() decorator
 *  3. Static default values for each option
 *
 * @param decoratorOptions options passed via the @Configurable() decorator
 * @param constructorOptions options passed via the config classes constructor
 */
function getOptions(decoratorOptions: IDecoratorOptions, constructorOptions: IDecoratorOptions): IDecoratorOptions {
  const defaultOptions: IDecoratorOptions = {
    parseArgv: { prefix: '' },
    parseEnv: { prefix: '', separator: '__', lowerCase: false },
    loadEnvFromFile: {},
    parseValues: true,
    strictTypeChecking: true,
    enforceReadonly: true,
  };

  return new Provider()
    .add('constructorOptions', { type: 'literal', store: constructorOptions })
    .add('decoratorOptions', { type: 'literal', store: decoratorOptions })
    .defaults(defaultOptions)
    .get();
}

/**
 * Get the final config object holding all property values of the final config instance.
 * The final config object is generated using three sources, listed by priority (1 = highest):
 *  1. Config values set via command line arguments
 *  2. Config values set via environment variables
 *  3. Config values set via the config class constructor
 *  4. Config values set via the config class property defaults
 *
 * @param options Options object containg all options relevant for generating the config object
 * @param ConfigClass Class the @Configurable() decorator was applied to
 * @param constructorValues Config values passed via the config class constructor
 */
function getConfig<T extends { new (...args: any[]): {} }>(
  options: IDecoratorOptions,
  ConfigClass: T,
  constructorValues: Partial<T>
): Partial<T> {
  // Collect all config values sources in order of hierarchy using an nconf provider
  const configProvider = new Provider();

  // 1. Command line arguments
  if (options.parseArgv) {
    const { prefix } = options.parseArgv;
    configProvider.argv({
      transform: obj => {
        // Only load environment variables starting with the given prefix
        if (!obj.key.startsWith(prefix)) {
          return false;
        }

        // Remove prefix from key
        return {
          key: obj.key.substring(prefix.length),
          value: obj.value,
        };
      },
    });
  }

  // 2. Environment variables
  if (options.parseEnv) {
    const { prefix } = options.parseEnv;

    configProvider.env({
      separator: options.parseEnv.separator,
      lowerCase: options.parseEnv.lowerCase,
      parseValues: options.parseValues,
      transform: obj => {
        // Only load environment variables starting with the given prefix
        if (!obj.key.startsWith(prefix)) {
          return false;
        }

        // Remove prefix from key
        return {
          key: obj.key.substring(prefix.length),
          value: obj.value,
        };
      },
    });
  }

  // 3. Values passed via the class constructor
  configProvider.add('constructorValues', {
    type: 'literal',
    store: constructorValues,
  });

  // 4. Config values set via the config class property defaults (instantiate the config class to obtain property default values)
  configProvider.defaults(new ConfigClass());

  return configProvider.get();
}

/**
 * Class decorator for marking a class configurable: The values of all class properties can be set using the following sources, listed by priority (1 = highest):
 *  1. Command line arguments
 *  2. Environment variables
 *  3. Constructor options on instantiation
 *  4. Defaults provided with the property definitions
 * The final values for the config instance's properties are calculated upon instantiation.
 * @param decoratorOptions Decorator options
 */
export function Configurable(decoratorOptions: IDecoratorOptions = {}) {
  return function<T extends { new (...args: any[]): {} }>(ConfigClass: T) {
    // Return a new class definition where the constructor has additional functionality
    return class extends ConfigClass {
      constructor(...args: any[]) {
        // Call the original constructor
        super(...args);

        // Parse options provided by the constructor (first argument) if the BaseConfig class was extended, ignore otherwise
        const constructorOptions: IConstructorOptions<T> =
          new ConfigClass() instanceof BaseConfig && isPlainObject(args[0]) ? args[0] : {};

        const options = getOptions(decoratorOptions, constructorOptions.options);

        if (options.loadEnvFromFile) {
          dotenv.load(options.loadEnvFromFile);
        }

        const config = getConfig<T>(options, ConfigClass, constructorOptions.config);

        assignValuesByTemplate(this, new ConfigClass(), config, options, ConfigClass.name);
      }
    };
  };
}
