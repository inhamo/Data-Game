import React, { useState } from 'react';
import { Bookmark, Check, ExternalLink, Mail } from 'lucide-react';
import { storyContent } from '../data';

function MeetingReflection({ onContinue }) {
  const reflection = storyContent.postMeetingReflection;
  const [saved, setSaved] = useState(false);

  return (
    <main className="meeting-reflection">
      <div className="cinema-grid" />
      <div className="light-ribbon ribbon-one" />
      <div className="light-ribbon ribbon-two" />
      <section>
        <p className="overline">After the meeting</p>
        <h1>{reflection.title}</h1>
        <div className="reflection-copy">
          <p>{reflection.body}</p>
          <blockquote>{reflection.principle}</blockquote>
          <p>{reflection.courseNote}</p>
        </div>
        <a className="workplace-story-link" href={reflection.reading.url} target="_blank" rel="noreferrer">
          <ExternalLink size={18} />
          <span><strong>{reflection.reading.title}</strong>{reflection.reading.summary}</span>
        </a>
        <div className="reflection-actions">
          <button className={saved ? 'icon-text saved-note' : 'icon-text'} onClick={() => setSaved(true)}>
            {saved ? <Check size={17} /> : <Bookmark size={17} />}
            {saved ? 'Saved for reread' : 'Save for reread'}
          </button>
          <button className="primary-button" onClick={onContinue}>
            Wait for the next email <Mail size={17} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default MeetingReflection;
