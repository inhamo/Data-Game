import React, { useState, useEffect } from 'react';
import { Clock3 } from 'lucide-react';
import { formatMinutes } from '../utils';

function WorkClock({ minutes }) {
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="work-clock">
      <Clock3 size={16} />
      <span>{clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
      <small>{formatMinutes(minutes)} worked</small>
    </div>
  );
}

export default WorkClock;