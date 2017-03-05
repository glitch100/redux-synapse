import React, { PropTypes } from 'react';

export default function StockItem({name, value, history}) {
  let change = 0;
  if (history.length > 0) {
    const previous = history[history.length - 1];
    change = ((value - previous) / previous * 100).toFixed(2);
  }
  return (
    <div>
      <div>
        <p>{name}</p>
        <p>Value: {value}</p>
        <p style={{
          color: change < 0 ? 'red' : 'green',
        }}>{change < 0 ? change : '+' + change}</p>
      </div>
      <br />
    </div>
  )
}

StockItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  history: PropTypes.array.isRequired,
};
