export const mapStateToProps = (state) => {
  return {
    name: state.trader.getIn(['details', 'name']),
    accountValue: state.trader.get('accountValue'),
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setName: (name) => dispatch({
      type: 'SET_TRADER_NAME',
      name,
    }),
    setAccountValue: () => {},
  };
};
