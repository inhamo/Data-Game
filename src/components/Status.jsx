import React from 'react';

function Status({ text }) {
  return <span className={`status status-${text.toLowerCase().replaceAll(" ", "-")}`}>{text}</span>;
}

export default Status;