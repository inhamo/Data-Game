import React from 'react';
import { appPath } from '../utils';

function SimMeetingRoom({ current, currentCharacter, peopleAsset, alt, children, variant = '' }) {
  const speaking = current?.speakerKey && current.speakerKey !== 'system';

  return (
    <section className={`boardroom-scene sim-room-scene ${variant} ${speaking ? 'is-speaking' : ''} emotion-${current?.emotion || 'neutral'}`}>
      <div className="sim-ceiling">
        <span /><span /><span />
      </div>
      <div className="sim-back-wall">
        <div className="sim-wood-panel left" />
        <div className="sim-wood-panel center" />
        <div className="sim-wood-panel right" />
        <div className="sim-door" />
        <div className="sim-plant plant-left" />
        <div className="sim-plant plant-right" />
      </div>
      <div className="board-screen">
        {children}
      </div>
      <div className="sim-floor" />
      <div className="sim-table back" />
      <div className="sim-table left" />
      <div className="sim-table right" />
      <div className="sim-table front" />
      <div className="sim-chair chair-1" />
      <div className="sim-chair chair-2" />
      <div className="sim-chair chair-3" />
      <div className="sim-chair chair-4" />
      <div className="sim-chair chair-5" />
      <img className="boardroom-people-asset" src={appPath(peopleAsset)} alt={alt} />
      <div className={`boardroom-speaker-card ${speaking ? 'speaking' : ''}`}>
        <span className="speaker-face">
          <img src={appPath(currentCharacter?.portrait || 'assets/people/meeting-overhead-team.webp')} alt="" />
          <i className="speaker-mouth" />
        </span>
        <div>
          <span>{currentCharacter?.role || 'Speaker'}</span>
          <strong>{current?.speaker}</strong>
          {current?.emotion && <small>{current.emotion}</small>}
        </div>
      </div>
    </section>
  );
}

export default SimMeetingRoom;
