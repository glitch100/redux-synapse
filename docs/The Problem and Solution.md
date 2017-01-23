## The Problem

`react` is a fantastic tool, however with larger trees you end up with an inefficient number of rerenders unless you are very strict with your `shouldComponentUpdates`, especially over frequently updated state in a standard flux model, or your own store implementation via `context`. As we know, `react-redux` utilises the `connect` higher order component to theoretically make your tree flat, so that updates are dished out directly from the store, and additional rerenders are only done if the state that we are interested in, handled via a `mapStateToProps` function, changes. This is fantastic as rerenders are expensive, and cutting them out can really solve a large number of performance problems. However in applications that are updating state frequently, such as a video based applcation, or a stock market tracker, you are going to lose performance before the rerenders even happens.

In `react` performance would go down just based on the fact that all those components are rerendering so frequently.
In `react-redux` although we shortcut the rerenders, we are still going to visit our `mapStateToProps` of most of our components, and in essence create a new object every single time to be returned and then evaluated upon. This is fine for smaller applications but in an application with 10's or 100's of components this is going to lead to performance problems.

## The Solution

This is where `redux-synapse` comes in. Using a similar syntactical solution to `react-redux`, a user can define what paths they are interested in on the state updates, and behind the scenes they are added as subscribers to those keys. If no paths are specified then it will just `subscribe` to the store like it would in `react-redux`, otherwise our `observer` behind the scenes will subscribe to updates to the store via our `reducers` and then using the paths that are specified as being updated in the reducer, will alert all necessary higher order components and trigger them to begin their own rerender cycle as opposed to visiting all components to then determine which ones should or shouldn't be updated.


