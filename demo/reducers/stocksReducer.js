import StocksRecord from '../records/StocksRecord';
import StockRecord from '../records/StockRecord';
import { List } from 'immutable';

const defaultState = new StocksRecord({
  allStocks: List([
    new StockRecord({
      name: 'FTSE 100',
      currentValue: 1000,
      previousValue: 750,
      valueDifference: 250,
      bidHistory: List([
        0,
      ]),
    }),
    new StockRecord({
      name: 'FTSE 250',
      currentValue: 5000,
      previousValue: 2500,
      valueDifference: 2500,
      bidHistory: List([
        0,
      ]),
    }),
    new StockRecord({
      name: 'FTSE 350',
      currentValue: 120,
      previousValue: 200,
      valueDifference: -80,
      bidHistory: List([
        0,
      ]),
    }),
  ]),
});

const stock = (state = defaultState, action) => {
  let newState;
  switch (action.type) {
  case 'SET_UPDATE_SPEED':
    newState = state.setIn(['options', 'updateSpeedMs'], action.updateSpeedMs);
    prepareNotification(['stock-options']);
    return newState;
  case 'ADD_STOCK':
    let allStocks = state.allStocks;
    allStocks = allStocks.push(new StockRecord(action.stock));
    newState = state.set('allStocks', allStocks);
    prepareNotification(['stocks']);
    return newState;
  default:
    return state;
  }
};

export default stock;
