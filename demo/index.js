import ReactDOM from 'react-dom';
import React from 'react';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'redux-synapse';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';
import StockApp from './components/StockApp';

const composeEnhancers = typeof window !== 'undefined'
  && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  : compose;

const createComposedStore = composeEnhancers(applyMiddleware(thunkMiddleware))(createStore);
const store = createComposedStore(combineReducers(reducers));

ReactDOM.render(
  <Provider store={store}>
    <StockApp />
  </Provider>,
  document.getElementById('app')
);

