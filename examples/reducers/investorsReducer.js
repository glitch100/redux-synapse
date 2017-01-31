const defaultState = [
  'FACEBOOK',
  'AMAZON',
  'NETFLIX',
  'TWITCH',
];

export default (state = defaultState, action) => {
  switch (action.type) {
  default:
    return state;
  }
};
