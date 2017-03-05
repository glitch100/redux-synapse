import {
  ADD_TRACKER,
  CHANGE_STOCK_VALUE,
} from '../actions/constants';
import { prepareNotification } from 'redux-synapse';

const defaultState = {
  FTSE100: {
    value: 7000,
    history: [6400],
  },
  GOOG: {
    value: 10000,
    history: [
      7000,
    ],
  },
  CORE: {
    value: 30000,
    history: [15000],
  },
};

export default (state = defaultState, action) => {
  let result;
  switch (action.type) {
  case ADD_TRACKER:
    result = Object.assign({
      [action.name]: {
        value: action.value,
        history: [],
      },
      ...state,
      });
    prepareNotification(['stock']);
    return result;
  case CHANGE_STOCK_VALUE:
    const item = state[action.name];
    item.history.push(item.value)
    action.add ? item.value += action.value :
                 item.value -= action.value;
    result = Object.assign({
      ...state,
      [action.name]: item,
      });
    prepareNotification(['stock']);
    return result;
  default:
    return state;
  }
};
