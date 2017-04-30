import React, { PropTypes } from 'react';
import StockItem from '../StockItem';

export default class StocksTable extends React.Component {
  static propTypes = {
    stocks: PropTypes.any.isRequired,
    addStock: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderStocks = () => {
    return this.props.stocks.map((p, i) => {
      return (
        <StockItem
          key={i}
          name={p.name}
          currentValue={p.currentValue}
          previousValue={p.previousValue}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <h2>Stocks Table</h2>
        {this.renderStocks()}
      </div>
    );
  }
}
