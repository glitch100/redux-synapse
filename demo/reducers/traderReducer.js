import TraderRecord from '../records/TraderRecord';
import { prepareNotification } from 'redux-synapse';

const trader = (state = new TraderRecord(), action) => {
  let newState;
  switch (action.type) {
  case 'SET_TRADER_VALUE':
    newState = state.set('accountValue', action.accountValue);
    prepareNotification(['trader']);
    return newState;
  case 'SET_TRADER_NAME':
    newState = state.set('name', action.name);
    prepareNotification(['trader']);
    return newState;
  default:
    return state;
  }
};

export default trader;
