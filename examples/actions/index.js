import { ADD_TRACKER } from './constants';

export const addTracker = (name, value) => {
  return {
    type: ADD_TRACKER,
    name,
    value,
  };
}
