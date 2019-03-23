[node-ts-repo-template](../README.md) > ["util"](../modules/_util_.md)

# External module: "util"

## Index

### Functions

* [assignValuesByTemplate](_util_.md#assignvaluesbytemplate)

---

## Functions

<a id="assignvaluesbytemplate"></a>

###  assignValuesByTemplate

▸ **assignValuesByTemplate**(obj: *`object`*, template: *`object`*, config: *`object`*, options: *[IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md)*, parent: *`string`*): `void`

Assign values to an object based on a template object's properties and their respective types

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| obj | `object` |  Object to set the properties on |
| template | `object` |  Template object which is used to determine which properties should be set on the object and of what type those properties are |
| config | `object` |  Config object containing all values for the properties to be set for the object |
| options | [IDecoratorOptions](../interfaces/_interfaces_.idecoratoroptions.md) |  Options object |
| parent | `string` |  Contains the current nested position in the object using the nested object dot notation (e.g. "obj1.nestedobj2.obj3"), used for error messages only |

**Returns:** `void`

___

