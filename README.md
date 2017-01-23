# `redux-synapse`
<img src="http://i.imgur.com/hAuOOkL.png" />

`redux-synapse` is a library that is heavily inspired by `react-redux` and acts as an alternative for the binding of react components to the store in a more explicit manner. The primary difference is the nature in which each component must declare explicity what updates should affect the component via its higher order component; a `synapse`.

A `synapse` is declared to listen to specific messages and act upon them. This is an early release of something that I intend to grow over time and build upon to make more efficient.

## What it looks like

### Provider
Much like `react-redux` we have a top level, `Provider` component, that the store should be passed too. This component is necessary for setting up our internal dictionary with subscriber lists.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'redux-synapse';

ReactDOM.render(
  <Provider store={store}>
    <StandardComponent />
  </Provider>,
  document.getElementById('app')
);
```

### A Standard Component
When setting up the component via `synapse`, you pass in the standard, `mapState*` functions, as well as an array of keys, that this component should update itself on. In this example we only have one level of state as we have a single reducer, however you can see that we have added two key-paths:
* `time`
* `options-enabled`

`time` is at the top level, however `options-enabled`, says you are interested in the `options` object, and the `enabled` property.

```js

import { synapse } from 'redux-synapse';

//...Component Declaration

const mapStateToProps = (state) => {
  return {
    time: state.time,
  };
}

const mapDispatchToProps = (state, dispatch) => {
  return {
    setTime: (time) => {
      dispatch({
        type: SET_TIME,
        time,
      });
    },
  };
};

export default synapse(mapStateToProps, mapDispatchToProps, ['time', 'options-enabled'])(StandardComponent);
```
### A Standard Reducer
When making changes to state, simply call `prepareNotification` with an array of the affected state keys. This will ensure that on the state being returned the interested components are updated appropriately.

```js
import { prepareNotification } from 'redux-synapse';

const defaultState = {
  time: 0,
  src: 'none',
  options: {
    enabled: true,
  }
};

export default video = (state = defaultState, action) => {
  switch(action.type) {
    case SET_TIME:
      state.time = action.time;
      prepareNotifcation(['time']);
      return state;
    default:
      return state;
  }
};
```

## Installation

```
npm install --save redux-synapse
```

## The Problem

`react` is a fantastic tool, however with larger trees you end up with an inefficient number of rerenders unless you are very strict with your `shouldComponentUpdates`, especially over frequently updated state in a standard flux model, or your own store implementation via `context`. As we know, `react-redux` utilises the `connect` higher order component to theoretically make your tree flat, so that updates are dished out directly from the store, and additional rerenders are only done if the state that we are interested in, handled via a `mapStateToProps` function, changes. This is fantastic as rerenders are expensive, and cutting them out can really solve a large number of performance problems. However in applications that are updating state frequently, such as a video based applcation, or a stock market tracker, you are going to lose performance before the rerenders even happens.

In `react` performance would go down just based on the fact that all those components are rerendering so frequently.
In `react-redux` although we shortcut the rerenders, we are still going to visit our `mapStateToProps` of most of our components, and in essence create a new object every single time to be returned and then evaluated upon. This is fine for smaller applications but in an application with 10's or 100's of components this is going to lead to performance problems.

## The Solution

This is where `redux-synapse` comes in. Using a similar syntactical solution to `react-redux`, a user can define what paths they are interested in on the state updates, and behind the scenes they are added as subscribers to those keys. If no paths are specified then it will just `subscribe` to the store like it would in `react-redux`, otherwise our `observer` behind the scenes will subscribe to updates to the store via our `reducers` and then using the paths that are specified as being updated in the reducer, will alert all necessary higher order components and trigger them to begin their own rerender cycle as opposed to visiting all components to then determine which ones should or shouldn't be updated.


