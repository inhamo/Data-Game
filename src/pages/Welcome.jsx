import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { storyContent } from '../data';

function Welcome({ onContinue }) {
  const [line, setLine] = useState(0);
  const screens = storyContent.welcomeScreens;

  useEffect(() => {
    if (line >= screens.length - 1) return;
    const timer = setTimeout(() => setLine((v) => v + 1), 2500);
    return () => clearTimeout(timer);
  }, [line]);

  return (
    <main className="cinema-screen" onClick={() => (line === screens.length - 1 ? onContinue() : setLine((v) => v + 1))}>
      <div className="cinema-grid" />
      <div className="light-ribbon ribbon-one" />
      <div className="light-ribbon ribbon-two" />
      <section key={line} className="cinema-copy">
        <p className="overline">An interactive life story</p>
        <h1>{screens[line].title}</h1>
        <p>{screens[line].body}</p>
      </section>
      <button className="skip-button" type="button">
        {line === screens.length - 1 ? 'Begin' : 'Continue'} <ChevronRight size={18} />
      </button>
      <span className="chapter-count">0{line + 1} / {String(screens.length).padStart(2, '0')}</span>
    </main>
  );
}

export default Welcome;
