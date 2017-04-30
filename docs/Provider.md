# Provider

The `Provider` works much like the `react-redux` provider as a top level component responsible for handling the child context, however it is not a 1 for 1 replacement. If you plan on using the features of `redux-synapse` then you must use the `Provider` that is available via this package.

## Props
|Name|Type|Description|Required|
|---|---|---|---|
|`store`|`Object`|The store that is created by `redux`|`Yes`|
|`children`|`node`|The `React` children|`Yes`|
|`delimiter`|`String`|What string to use for the internal dictionary when delimiting keys. Defaults to `'-'` if not provided.|`No`|
|`reverseTravesal`|`Boolean`|Whether to notify each key in a provided path. Defaults to `true` if not provided.|`No`|

## Behind the scenes
The `Provider` is responsible for building the internal observer dictionary that is used to determine subscribers across state keys, and paths, from the store state tree.

## Example Usage
```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'redux-synapse';
import { createStore } from 'redux';

const store = creatStore(...);

ReactDOM.render(
  <Provider store={store}>
    <StandardComponent />
  </Provider>,
  document.getElementById('app')
);
```

### `delimiter` Use case
You may find that you have some dynamic keys, or even keys that utilise the `'-'` in their naming. As such we allow users to change the internal delimiter to something else. Single characters are recommended.

### `reverseTraversal` Use case
Take the following key path:
`video-options-playbackspeed`

With `reverseTraversal` enabled (_by default it is_) the following keys and their subscriptions would be notified:
- video
- options
- playbackspeed

With it disabled it would only notify the following:
- playbackspeed

This allows for a much more explicit approach to defining keys for updates. It also becomes useful in large state trees with various levels, so you can effectively partition updates to entire sections of the react tree.
