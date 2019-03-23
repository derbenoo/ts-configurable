import * as isPlainObject from 'is-plain-object'; // https://www.npmjs.com/package/is-plain-object
import { IDecoratorOptions } from './interfaces';

/**
 * Assign values to an object based on a template object's properties and their respective types
 * @param obj Object to set the properties on
 * @param template Template object which is used to determine which properties should be set on the object and of what type those properties are
 * @param config Config object containing all values for the properties to be set for the object
 * @param options Options object
 * @param parent Contains the current nested position in the object using the nested object dot notation (e.g. "obj1.nestedobj2.obj3"), used for error messages only
 */
export function assignValuesByTemplate(
  obj: object,
  template: object,
  config: object,
  options: IDecoratorOptions,
  parent: string
) {
  Object.keys(template).forEach(key => {
    const templateValue = template[key];
    const value = config[key];

    if (isPlainObject(templateValue)) {
      if (isPlainObject(value)) {
        obj[key] = {};
        assignValuesByTemplate(obj[key], templateValue, value, options, `${parent}.${key}`);
      } else {
        throw new TypeError(
          `Property '${parent}.${key}' is of type object but a non-object value ('${JSON.stringify(
            value
          )}') was assigned!`
        );
      }
    } else if (Array.isArray(templateValue)) {
      if (Array.isArray(value)) {
        obj[key] = value;
        if (options.enforceReadonly) {
          Object.freeze(value);
        }
      } else {
        throw new TypeError(
          `Property '${parent}.${key}' is of type array but a non-array value ('${JSON.stringify(
            value
          )}') was assigned!`
        );
      }
    } else if (templateValue === null || templateValue === undefined) {
      // No type given by template property -> all primitive types are allowed
      if (typeof value !== 'object' || value === null) {
        obj[key] = value;
      } else {
        throw new TypeError(
          `Property '${parent}.${key}' is of type null or undefined but a non-primitive value ('${JSON.stringify(
            value
          )}') was assigned!`
        );
      }
    } else {
      // Template property is a primitive type -> make sure value is a primitive type as well
      if (typeof value !== 'object' || value === null) {
        if (!options.strictTypeChecking || typeof templateValue === typeof value) {
          obj[key] = value;
        } else {
          throw new TypeError(
            `Property '${parent}.${key}' is of type ${typeof templateValue} but a value of type ${typeof value} ('${JSON.stringify(
              value
            )}') was assigned!`
          );
        }
      } else {
        throw new TypeError(
          `Property '${parent}.${key}' is of type ${typeof templateValue} but a non-primitive value ('${JSON.stringify(
            value
          )}') was assigned!`
        );
      }
    }
  });

  if (options.enforceReadonly) {
    Object.freeze(obj);
  }
}
