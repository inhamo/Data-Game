import React from 'react';

function BrandMark({ compact }) {
  return (
    <div className={`brand-mark ${compact ? "compact" : ""}`}>
      <span>P</span>
      <strong>PLATO</strong>
    </div>
  );
}

export default BrandMark;