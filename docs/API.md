# API
This outlines the API that is available to use, alongside the Primary components such as the `Provider` and `Synapse`.

## `generateSynapseRecord(defaultState: any, stateKey: String, getters: Object)`

### Parameters
- `defaultState` : The default state for a reducer. It accepts, `Immutable.Record|Maps|List`s, or plain old javascript objects. However it doesn't support `Immutable.Record` implementations with custom getters.
- `stateKey` : The associated state key for which this record will be attached to. If you build a reducer and it is added to the store under the key of `"trader"`, then `"trader"` would be the value of this parameter.
- `getters` : Experimental feature for attaching `getters` onto the created `SynapseRecord`

### Outline
The `generateSynapseRecord` is a utility aimed at breaking the requirement for the `prepareNotification` paradigm that would be used inside your reducers with `redux-synapse`.

It's purpose is to remove the need for the `prepareNotification` API that is used within reducers. It does this by wrapping the provided `defaultState` in a version of an `Immutable.Record`. This hooks into all `set` and `setIn` calls that are used to manually prepare the notifications for the underlying synapse engine.

It does however require the `stateKey` that this reducer is associated with to be provided.

> The `generateSynapseRecord` API may not support custom implementations of the `Immutable.Record` class.

### Example
The below example outlines a reducer for the `trader` state key, and how the`generateSynapseRecord` API works alongside an `immutable` record.

```js
import { Record } from 'immutable'
import { generateSynapseRecord } from 'redux-synapse';

// Immutable Record of trader state
const TraderRecord = Record({
  name: 'NONE_SET',
  accountValue: 0,
});

// The expected property name of the reducer on the redux state
const STATE_KEY = 'trader';
const defaultState = generateSynapseRecord(new TraderRecord(), STATE_KEY);

// Our Reducer
const trader = (state = defaultState, action) => {
  let newState;
  switch (action.type) {
  case 'SET_TRADER_VALUE':
    newState = state.set('accountValue', action.accountValue);
    return newState;
  case 'SET_TRADER_NAME':
    newState = state.set('name', action.name);
    return newState;
  default:
    return state;
  }
};

export default trader;
```

## `prepareNotification(keys: Array<String>)`

### Parameters
- `keys` : An array of keys that are used to determine which component subscriptions should be updated.

### Outline
The `prepareNotification` API should be called with an array of the top level keys that have been affected. For example if you have an object in your `redux` state with the key `video`, then you would change those properties and then call `prepareNotification` with the `video` key. This ensures that all relevant subscribers are updated, and only them. A `notify` operation is initiated at the end of the redux `reducer` cycle.

### Example


```js
import { prepareNotification } from 'redux-synapse';
import { Map } from 'immutable';

// Our default state
const defaultState = Map({
  time: 0,
  src: 'none',
  options: Map({
    enabled: true,
  }),
});


// Our video reducer
export default video = (state = defaultState, action) => {
  switch(action.type) {
    case SET_TIME:
      state = state.set('time', action.time);
      // We are updating the `time` property on the `video` state key. As
      // such we prepare a notification for the components that are subscribed to
      // changes to the `video` state key
      prepareNotification(['video-time']);
      return state;
    case SET_OPTIONS_ENABLED:
      const options = state.options;
      state = state.set('options', options.set('enabled', action.enabled));
      // We have updated the `options` object, on the `video` state key. As such
      // we prepare a notification for anyone that is subscribed to changes
      // on the `video` state key or the `options` object.
      prepareNotification(['video-options-enabled']);
    default:
      return state;
  }
};
```
> `redux-synapse` supports a `super-explicit` mode so that in the example of nested objects (`video-options`) it would require
> an explicit subscription to the nested object, and it wouldn't update subscribers on the `video` key.
