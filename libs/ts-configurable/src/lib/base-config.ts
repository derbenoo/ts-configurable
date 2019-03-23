import { IConstructorOptions } from './interfaces';

export abstract class BaseConfig<T> {
  /**
   * Create a new config instance
   * @param constructorOptions Options for creating a new config instance
   */
  constructor(constructorOptions?: IConstructorOptions<T>) {}
}
