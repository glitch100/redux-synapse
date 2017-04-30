import React, { PropTypes } from 'react';

export default function StockItem({ name, currentValue, previousValue }) {
  return (
    <div>
      <div>{name}</div>
      <div>{currentValue}</div>
      <div>{previousValue}</div>
      <div>
        <button>Buy</button>
        <button>Sell</button>
      </div>
    </div>
  );
}

StockItem.propTypes = {
  name: PropTypes.string.isRequired,
  currentValue: PropTypes.number.isRequired,
  previousValue: PropTypes.number.isRequired,
};
