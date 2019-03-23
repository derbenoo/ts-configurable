[node-ts-repo-template](../README.md) > ["configurable"](../modules/_configurable_.md)

# External module: "configurable"

## Index

### Functions

* [Configurable](_configurable_.md#configurable)
* [getConfig](_configurable_.md#getconfig)
* [getOptions](_configurable_.md#getoptions)

---

## Functions

<a id="configurable"></a>

###  Configurable

▸ **Configurable**(decoratorOptions?: *[IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)*): `(Anonymous function)`

Class decorator for marking a class configurable: The values of all class properties can be set using the following sources, listed by priority (1 = highest):

1.  Command line arguments
2.  Environment variables
3.  Constructor options on instantiation
4.  Defaults provided with the property definitions The final values for the config instance's properties are calculated upon instantiation.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` decoratorOptions | [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md) |  {} |  Decorator options |

**Returns:** `(Anonymous function)`

___
<a id="getconfig"></a>

###  getConfig

▸ **getConfig**<`T`>(options: *[IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)*, ConfigClass: *`T`*, constructorValues: *`Partial`<`T`>*): `Partial`<`T`>

Get the final config object holding all property values of the final config instance. The final config object is generated using three sources, listed by priority (1 = highest):

1.  Config values set via command line arguments
2.  Config values set via environment variables
3.  Config values set via the config class constructor
4.  Config values set via the config class property defaults

**Type parameters:**

#### T :  `object`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md) |  Options object containg all options relevant for generating the config object |
| ConfigClass | `T` |  Class the @Configurable() decorator was applied to |
| constructorValues | `Partial`<`T`> |  Config values passed via the config class constructor |

**Returns:** `Partial`<`T`>

___
<a id="getoptions"></a>

###  getOptions

▸ **getOptions**(decoratorOptions: *[IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)*, constructorOptions: *[IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)*): [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)

Get the final options object containing all options for the @Configurable() decorator. The options are generated using three sources, listed by priority (1 = highest):

1.  Options set via the config class constructor.
2.  Options set via the @Configurable() decorator
3.  Static default values for each option

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| decoratorOptions | [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md) |  options passed via the @Configurable() decorator |
| constructorOptions | [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md) |  options passed via the config classes constructor |

**Returns:** [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)

___

