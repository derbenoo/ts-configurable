[node-ts-repo-template](../README.md) > ["interfaces"](../modules/_interfaces_.md) > [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)

# Interface: IDecoratorOptions

Options for the @Configurable() decorator

## Hierarchy

**IDecoratorOptions**

## Index

### Properties

* [enforceReadonly](_interfaces_.idecoratoroptions.md#enforcereadonly)
* [loadEnvFromFile](_interfaces_.idecoratoroptions.md#loadenvfromfile)
* [parseArgv](_interfaces_.idecoratoroptions.md#parseargv)
* [parseEnv](_interfaces_.idecoratoroptions.md#parseenv)
* [parseValues](_interfaces_.idecoratoroptions.md#parsevalues)
* [strictTypeChecking](_interfaces_.idecoratoroptions.md#stricttypechecking)

---

## Properties

<a id="enforcereadonly"></a>

### `<Optional>` enforceReadonly

**● enforceReadonly**: *`boolean`*

Enforce that all properties are read-only by using Object.freeze() (default: true)

___
<a id="loadenvfromfile"></a>

### `<Optional>` loadEnvFromFile

**● loadEnvFromFile**: *`false` \| `DotenvConfigOptions`*

Apply environment variables from a file to the current process.env

___
<a id="parseargv"></a>

### `<Optional>` parseArgv

**● parseArgv**: *`false` \| [IArgvOptions](_interfaces_.iargvoptions.md)*

Whether to parse command line arguments (default: true)

___
<a id="parseenv"></a>

### `<Optional>` parseEnv

**● parseEnv**: *`false` \| [IEnvOptions](_interfaces_.ienvoptions.md)*

Whether to parse environment variables (default: true)

___
<a id="parsevalues"></a>

### `<Optional>` parseValues

**● parseValues**: *`boolean`*

Attempt to parse well-known values (e.g. 'false', 'null', 'undefined' and JSON values) into their proper types (default: true)

___
<a id="stricttypechecking"></a>

### `<Optional>` strictTypeChecking

**● strictTypeChecking**: *`boolean`*

Throw an error if a config entry is set to a value of a different type than the default value (e.g. assigning a number to a string property) (default: true)

___

