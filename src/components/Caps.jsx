import React from 'react';
import { GraduationCap } from 'lucide-react';

function Caps() {
  return (
    <div className="caps">
      {Array.from({ length: 15 }).map((_, i) => (
        <GraduationCap key={i} style={{ "--x": `${(i * 73) % 100}vw`, "--r": `${(i % 2 ? 1 : -1) * (20 + i * 13)}deg`, "--d": `${i * 45}ms` }} />
      ))}
    </div>
  );
}

export default Caps;