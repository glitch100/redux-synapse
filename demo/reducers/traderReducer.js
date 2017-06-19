import TraderRecord from '../records/TraderRecord';
import { generateSynapseRecord } from 'redux-synapse';

const STATE_KEY = 'trader';
const defaultState = generateSynapseRecord(new TraderRecord(), STATE_KEY);
const trader = (state = defaultState, action) => {
  let newState;
  switch (action.type) {
  case 'SET_TRADER_VALUE':
    newState = state.set('accountValue', action.accountValue);
    return newState;
  case 'SET_TRADER_NAME':
    newState = state.setIn(['details', 'name'], action.name);
    return newState;
  case 'SET_TRADER_STREET':
    newState = state.setIn(['details', 'address', 'street'], action.street);
    return newState;
  default:
    return state;
  }
};

export default trader;
