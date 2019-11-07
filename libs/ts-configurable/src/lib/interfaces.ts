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

interface IDecryptionSecret {
  type: 'env' | 'file' | 'raw';
}

export interface IDecryptionSecretRaw extends IDecryptionSecret {
  type: 'raw';
  secret: string;
}

export interface IDecryptionSecretFile extends IDecryptionSecret {
  type: 'file';
  filepath: string;
  fileOptions?: { encoding?: null; flag?: string } | null;
}

export interface IDecryptionSecretEnvironment extends IDecryptionSecret {
  type: 'env';
  environmentVariable: string;
}

export type DecryptionSecret =
  | IDecryptionSecretRaw
  | IDecryptionSecretFile
  | IDecryptionSecretEnvironment;

export interface IDecryptionOptions {
  /** Decryption secrets each used to attempt the decryption of any encrypted configuration value */
  secrets: DecryptionSecret[];
  /** Whether to set a non-decryptable configuration value to null (default: false) */
  setNullOnDecryptionFailure?: boolean;
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
  /** Throw an error if a config entry is set to a value of a different structure than the default value (e.g., assigning an object to a primitive property) (default: true) */
  strictObjectStructureChecking?: boolean;
  /** Enforce that all properties are read-only by using Object.freeze() (default: true) */
  enforceReadonly?: boolean;
  /** Apply environment variables from a file to the current process.env (default: true)*/
  loadEnvFromFile?: false | DotenvConfigOptions;
  /** Whether to attempt decryption of encrypted configuration values (default: false) */
  decryption?: false | IDecryptionOptions;
}

export interface IConstructorOptions<T> {
  /** (Partial) configuration object overriding the default values of the configuration class */
  config?: Partial<T>;
  /** Options object for the @Configurable() decorator, overriding the one given in the decorator */
  options?: IDecoratorOptions;
}
