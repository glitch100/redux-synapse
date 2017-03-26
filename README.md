# `redux-synapse`

<img src="http://i.imgur.com/hAuOOkL.png" />

[![npm](https://img.shields.io/npm/dt/redux-synapse.svg)]() [![npm](https://img.shields.io/npm/v/redux-synapse.svg)]() [![npm](https://img.shields.io/npm/l/redux-synapse.svg)]()


`redux-synapse` is a library that is heavily inspired by `react-redux` and acts as an alternative for the binding of react components to the store in a more explicit manner. The primary difference is the nature in which each component must declare explicity what updates should affect the component via its higher order component; a `synapse`. With `synapse`'s it is possible to achieve a higher level of performance, than you would with alternative libraries.

A `synapse` is declared to listen to specific messages and act upon them. This is an early release of something that I intend to grow over time and build upon to make more efficient.

## Installation

Install `redux-synapse` using `npm` withte following command.

```
npm install --save redux-synapse
```
#### [Available on npm](https://www.npmjs.com/package/redux-synapse)

## Read Docs

* `Synapse` HOC [here](/docs/Synapse.md)
* `Provider` [here](/docs/Provider.md)
* `API` [here](/docs/API.md)


## Why `redux-synapse` exists

### The Problem to Solve
`react` is a fantastic tool, however with larger trees you end up with an inefficient number of rerenders unless you are very strict with your `shouldComponentUpdates`, especially over frequently updated state in a standard flux model, or your own store implementation via `context`. As we know, `react-redux` utilises the `connect` higher order component to theoretically make your tree flat, so that updates are dished out directly from the store, and additional rerenders are only done if the state that we are interested in, handled via a `mapStateToProps` function, changes. This is fantastic as rerenders are expensive, and cutting them out can really solve a large number of performance problems. However in applications that are updating state frequently, such as a video based applcation, or a stock market tracker, you are going to lose performance before the rerenders even happens.

In `react` performance would go down just based on the fact that all those components are rerendering so frequently.
In `react-redux` although we shortcut the rerenders, we are still going to visit our `mapStateToProps` of most of our components, and in essence create a new object every single time to be returned and then evaluated upon. This is fine for smaller applications but in an application with 10's or 100's of components this is going to lead to performance problems.

### The Solution

This is where `redux-synapse` comes in. Using a similar syntactical solution to `react-redux`, a user can define what paths they are interested in on the state updates, and behind the scenes they are added as subscribers to those keys. If no paths are specified then it will just `subscribe` to the store like it would in `react-redux`, otherwise our `observer` behind the scenes will subscribe to updates to the store via our `reducers` and then using the paths that are specified as being updated in the reducer, will alert all necessary higher order components and trigger them to begin their own rerender cycle as opposed to visiting all components to then determine which ones should or shouldn't be updated.


