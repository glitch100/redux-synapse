import { Record, List } from 'immutable';

export default Record({
  name: '',
  currentValue: 0,
  previousValue: 0,
  valueDifference: 0,
  bidHistory: List(),
});
