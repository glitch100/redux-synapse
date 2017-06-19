import React from 'react';
import TraderName from './TraderName';
import TraderAddress from './TraderAddress';
import StocksTable from './StocksTable';
import './style.scss';

export default function StockApp() {
  return (
    <div>
      <p>Synape Demo Page for Stock Application (In Progress)</p>
      <TraderName />
      <TraderAddress />
      <StocksTable />
    </div>
  );
}
