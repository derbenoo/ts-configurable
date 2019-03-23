import { DotenvConfigOptions } from 'dotenv';

/** Environment variables specific options */
export interface IEnvOptions {
  /** Seperator for environment variables (default: '__') */
  separator?: string;
  /** Whether to lower-case environment variables (default: false) */
  lowerCase?: boolean;
  /** Prefix for environment variables (default: '') */
  prefix?: string;
}

/** Command line arguments specific options */
interface IArgvOptions {
  /** Prefix for command line arguments (default: '') */
  prefix?: string;
}

/** Options for the @Configurable() decorator */
export interface IDecoratorOptions {
  /** Whether to parse command line arguments (default: true) */
  parseArgv?: false | IArgvOptions;
  /** Whether to parse environment variables (default: true) */
  parseEnv?: false | IEnvOptions;
  /** Attempt to parse well-known values (e.g. 'false', 'null', 'undefined' and JSON values) into their proper types (default: true) */
  parseValues?: boolean;
  /** Throw an error if a config entry is set to a value of a different type than the default value (e.g. assigning a number to a string property) (default: true) */
  strictTypeChecking?: boolean;
  /** Enforce that all properties are read-only by using Object.freeze() (default: true) */
  enforceReadonly?: boolean;
  /** Apply environment variables from a file to the current process.env (default: true)*/
  loadEnvFromFile?: false | DotenvConfigOptions;
}

export interface IConstructorOptions<T> {
  /** (Partial) configuration object overriding the default values of the configuration class */
  config?: Partial<T>;
  /** Options object for the @Configurable() decorator, overriding the one given in the decorator */
  options?: IDecoratorOptions;
}
