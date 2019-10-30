import { attemptDecryption } from './encryption-utils';
import { IDecoratorOptions } from './interfaces';

/**
 * Check whether a given value is a Javascript object
 * @param val value to check
 */
export function isObject(val: any): boolean {
  return (
    val !== null && val !== undefined && typeof val === 'object' && Array.isArray(val) === false
  );
}

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
  decryptionKeys: Buffer[],
  parent: string
) {
  Object.keys(template).forEach(key => {
    const templateValue = template[key];
    let value = config[key];

    if (decryptionKeys && decryptionKeys.length > 0) {
      value = attemptDecryption(decryptionKeys, value);
    }

    if (isObject(templateValue)) {
      if (isObject(value)) {
        obj[key] = {};
        assignValuesByTemplate(
          obj[key],
          templateValue,
          value,
          options,
          decryptionKeys,
          `${parent}.${key}`
        );
      } else if (!options.strictObjectStructureChecking) {
        obj[key] = value;
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
      } else if (!options.strictObjectStructureChecking) {
        obj[key] = value;
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
      } else if (!options.strictObjectStructureChecking) {
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
      } else if (!options.strictObjectStructureChecking) {
        obj[key] = value;
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
