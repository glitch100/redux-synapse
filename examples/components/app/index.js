import React, { Component } from 'react';
import StockList from '../StockList';
import AddStockTracker from '../AddStockTracker';
import InvestorOverview from '../InvestorOverview';

export default class App extends Component {
  render() {
    return (
      <div>
        <AddStockTracker />
        <InvestorOverview />
        <StockList />
      </div>
    );
  }
}
