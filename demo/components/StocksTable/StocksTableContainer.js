export const mapStateToProps = (state) => {
  return {
    stocks: state.stocks.allStocks,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    addStock: (name, currentValue, previousValue) => dispatch({
      type: 'ADD_STOCK',
      name,
      currentValue,
      previousValue,
    }),
  };
};
