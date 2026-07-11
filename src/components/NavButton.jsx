import React from 'react';

function NavButton({ icon: Icon, label, active, count, onClick }) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      <Icon size={19} />
      <span>{label}</span>
      {count > 0 && <b>{count}</b>}
    </button>
  );
}

export default NavButton;