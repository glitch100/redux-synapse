import StocksRecord from '../records/StocksRecord';
import StockRecord from '../records/StockRecord';
import { List } from 'immutable';

const defaultState = new StocksRecord({
  allStocks: List([
    new StockRecord({
      name: 'FTSE',
      currentValue: 1000,
      previousValue: 750,
      valueDifference: 250,
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
