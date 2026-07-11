import React from 'react';

function Person({ faculty, graduate, main, presenter }) {
  return (
    <div className={`person ${faculty ? "faculty" : ""} ${graduate ? "graduate" : ""} ${main ? "main-graduate" : ""} ${presenter ? "presenter" : ""}`}>
      <i className="head" />
      <i className="body" />
      {graduate && <i className="cap" />}
    </div>
  );
}

export default Person;