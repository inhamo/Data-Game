import React, { useState } from 'react';
import { Search, ChevronRight, Check, ArrowLeft, BriefcaseBusiness, MessageCircle, Mail, FileText, Clock3, UserRound } from 'lucide-react';
import { Avatar, WorkClock } from '../components';
import { CaseZero } from '.';
import { seasonCases } from '../data';
import { initials } from '../utils';

function SeasonWorkspace({ profile, certificate, workRecord, onUpdate, onExit }) {
  const [activeCase, setActiveCase] = useState(null);

  if (activeCase === 0) {
    return (
      <CaseZero
        profile={profile}
        onBack={() => setActiveCase(null)}
        onComplete={() => {
          onUpdate({ ...workRecord, case0: true, totalMinutes: (workRecord?.totalMinutes || certificate.minutes) + 120 });
          setActiveCase(null);
        }}
      />
    );
  }

  return (
    <main className="season-desk">
      <header>
        <div className="offer-brand"><span>SR</span><strong>SOLSTICE RETAIL GROUP</strong></div>
        <div className="workspace-search"><Search size={17} /> Search cases, files, and people</div>
        <WorkClock minutes={workRecord?.totalMinutes || certificate.minutes} />
        <button className="profile-button"><Avatar text={initials(profile.name)} /></button>
      </header>
      <div className="season-shell">
        <aside>
          <div className="season-profile">
            <Avatar text={initials(profile.name)} />
            <strong>{profile.name}</strong>
            <span>Junior Data Analyst</span>
            <small>Customer Insights</small>
          </div>
          <nav>
            <button className="active"><BriefcaseBusiness size={18} /> Case desk</button>
            <button><MessageCircle size={18} /> Slack</button>
            <button><Mail size={18} /> Mail</button>
            <button><FileText size={18} /> Reports</button>
          </nav>
          <button className="exit-work" onClick={onExit}><ArrowLeft size={17} /> Career profile</button>
        </aside>
        <section className="season-overview">
          <div className="season-heading">
            <div>
              <p className="overline">Season One · Quarter 1</p>
              <h1>The Loyalty Problem</h1>
              <p>You joined Solstice to help explain customer behaviour. Every department already has a confident answer. Your job is to find the one the evidence can survive.</p>
            </div>
            <div className="season-score">
              <span>Structure</span>
              <strong>{workRecord?.case0 ? 1 : 0}</strong>
              <small>skill points</small>
            </div>
          </div>
          <div className="case-list">
            {seasonCases.map((item, index) => {
              const unlocked = index === 0;
              const complete = index === 0 && workRecord?.case0;
              return (
                <button key={item[0]} className={`${unlocked ? 'unlocked' : 'locked'} ${complete ? 'complete' : ''}`} disabled={!unlocked} onClick={() => setActiveCase(index)}>
                  <span className="case-number">{complete ? <Check size={17} /> : item[0]}</span>
                  <div><strong>{item[1]}</strong><small>{item[2]}</small></div>
                  <span className="case-state">{complete ? 'Completed' : unlocked ? 'Open case' : 'Locked'}</span>
                  <ChevronRight size={17} />
                </button>
              );
            })}
          </div>
        </section>
        <aside className="case-brief">
          <p className="overline">Current assignment</p>
          <h2>{workRecord?.case0 ? 'Case 01 unlocks next' : 'Welcome Aboard'}</h2>
          <p>{workRecord?.case0 ? 'Priya is reviewing your first ticket. The next case begins when Marcus Webb sends a direct request.' : 'Set up your desk, read the previous work, and repair a broken dashboard filter.'}</p>
          <div className="brief-meta">
            <span><Clock3 size={15} /> 2 simulated hours</span>
            <span><UserRound size={15} /> Priya Shah</span>
          </div>
          {!workRecord?.case0 && (
            <button className="primary-button" onClick={() => setActiveCase(0)}>Start Case 0 <ChevronRight size={17} /></button>
          )}
        </aside>
      </div>
    </main>
  );
}

export default SeasonWorkspace;