# Synapse

## `synapse(mapStateToProps: function, mapDispatchToProps: ?function, pathArray: ?Array): function `

The `synapse` is the higher order component used for wrapping the components provided, and providing associated prop maps, for dispatch and state, in addition it takes an array of properties that are used to determine whether it is updated. This is the primary function of the library; `synapse`'d components will allow developers to specify exactly when that component should even be updated from any redux update, as opposed to the component comparing it's internal `mapStateToProps` to determine for updates.

## Params
|Name|Type|Description|Required|
|---|---|---|---|
|`mapStateToProps`|`function`|Much like the `react-redux` function, this is used to return an object used for props based on the redux store state|`Yes`|
|`mapDispatchToProps`|`function`|Much like th `react-redux` function, this is used to return an object used for props that can provide store `dispatch`'s for specific props|`No`|
|`pathArray`|`Array`|An array of paths to specific state keys that this component will await updates on|`No`|

## Behind the scenes
The `Provider` is responsible for building the internal observer dictionary that is used to determine subscribers across state keys, and paths, from the store state tree.

## Example
When setting up the component via `synapse`, you pass in the standard, `mapState*` functions, as well as an array of keys, that this component should update itself on.

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

// We are subscribing to changes in the `video.options` key of the redux state.
export default synapse(mapStateToProps, mapDispatchToProps, ['video-options'])(StandardComponent);
```
