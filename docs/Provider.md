# Provider

The `Provider` works much like the `react-redux` provider as a top level component responsible for handling the child context, however it is not a 1 for 1 replacement. If you plan on using the features of `redux-synapse` then you must use the `Provider` that is available via this package.

## Props
|Name|Type|Description|Required|
|---|---|---|---|
|`store`|`Object`|The store that is created by `redux`|`Yes`|
|`children`|`node`|The `React` children|`Yes`|

## Behind the scenes
The `Provider` is responsible for building the internal observer dictionary that is used to determine subscribers across state keys, and paths, from the store state tree.
