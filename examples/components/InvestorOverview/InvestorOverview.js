import React from 'react';

export default function InvestorOverview({ investors = [] }) {
  const inv = investors.map((i) => {
    return (<p>{i}</p>);
  });
  return (
    <div>
      {inv}
    </div>
  );
}
