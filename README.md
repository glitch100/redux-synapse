# `redux-synapse`
<img src="http://i.imgur.com/hAuOOkL.png" />

`redux-synapse` is a library that is heavily inspired by `react-redux` and acts as an alternative for the binding of react components to the store in a more explicit manner. The primary difference is the nature in which each component must declare explicity what updates should affect the component via its higher order component; a `synapse`. With `synapse`'s it is possible to achieve a higher level of performance, than you would with alternative libraries.

A `synapse` is declared to listen to specific messages and act upon them. This is an early release of something that I intend to grow over time and build upon to make more efficient.

## Installation

```
npm install --save redux-synapse
```

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
      prepareNotification(['time']);
      return state;
    default:
      return state;
  }
};
```

