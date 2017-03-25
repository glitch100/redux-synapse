import React from 'react';
import TraderCTA from './TraderCTA';
import StocksTable from './StocksTable';
import './style.scss';

export default function StockApp() {
  return (
    <div>
      <p>Synape Demo Page for Stock Application (In Progress)</p>
      <TraderCTA />
      <StocksTable />
    </div>
  );
}
