export const mapStateToProps = (state) => {
  return {
    street: state.trader.getIn(['details', 'address', 'street']),
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setStreet: (street) => dispatch({
      type: 'SET_TRADER_STREET',
      street,
    }),
  };
};
