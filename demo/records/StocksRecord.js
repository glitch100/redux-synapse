import { Record, List } from 'immutable';

const OptionsRecord = Record({
  updateSpeedMs: 2500,
});

export default Record({
  stockTotalValue: 0,
  allStocks: List(),
  options: new OptionsRecord(),
});

