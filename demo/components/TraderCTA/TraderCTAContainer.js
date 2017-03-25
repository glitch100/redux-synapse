export const mapStateToProps = (state) => {
  return {
    name: state.trader.name,
    accountValue: state.trader.accountValue,
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
