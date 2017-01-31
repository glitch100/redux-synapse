import React, { Component, PropTypes } from 'react';
import StockItem from '../StockItem';

export default class StockList extends Component {
  static propTypes = {
    stock: PropTypes.object.isRequired,
    changeStock: PropTypes.func.isRequired,
  };

  static defaultPropTypes = {
    stock: {},
  };

  constructor() {
    super();
    this.state = {
      stockItems: [],
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.props.changeStock(this.props.stock);
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    this.generateStockItems(nextProps.stock, nextProps.changeStock);
  }

  generateStockItems(stock, changeStock) {
    const keys = Object.keys(stock);
    const stockItems = [];
    for (let i = 0; i < keys.length; i++) {
      const item = stock[keys[i]];
      stockItems.push(<StockItem
        name={keys[i]}
        value={item.value}
        history={item.history}
      />)
    }
    this.setState({
      stockItems,
    });
  }

  render() {
    return (
      <div>
        <h2>Stock List</h2>
        {this.state.stockItems}
      </div>
    );
  }
}
