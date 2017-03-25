import React, { PropTypes } from 'react';

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
        <p key={i}>{p.name}</p>
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
