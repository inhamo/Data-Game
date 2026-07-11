import React from 'react';

function Empty({ icon: Icon, title, text }) {
  return (
    <div className="empty">
      <Icon size={28} />
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

export default Empty;